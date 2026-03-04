"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/context";
import { Send, MessageCircle, User, RefreshCw, ArrowLeft, Truck, ShieldCheck, Wrench, Zap } from "lucide-react";

interface Conversation {
    id: string;
    user_id: string;
    userEmail?: string;
    userName?: string;
}

interface Message {
    id: string;
    content: string;
    is_admin: boolean;
    sender_id: string;
    created_at: string;
}

export default function AdminChatPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [showMobileList, setShowMobileList] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [loadingConvs, setLoadingConvs] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Fetch conversations and hydrate with user info via a separate query
    const loadConversations = useCallback(async () => {
        setLoadingConvs(true);
        const { data: convs } = await supabase
            .from("conversations")
            .select("id, user_id")
            .order("created_at", { ascending: false });

        if (!convs || convs.length === 0) {
            setConversations([]);
            setLoadingConvs(false);
            return;
        }

        // Fetch user info for all conversation owners in one shot
        const userIds = convs.map((c) => c.user_id);
        const { data: users } = await supabase
            .from("users")
            .select("id, email, name")
            .in("id", userIds);

        const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));

        const enriched: Conversation[] = convs.map((c) => ({
            id: c.id,
            user_id: c.user_id,
            userEmail: userMap[c.user_id]?.email ?? "Unknown",
            userName: userMap[c.user_id]?.name ?? undefined,
        }));

        setConversations(enriched);
        setLoadingConvs(false);
    }, []);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    // When a conversation is selected, load its messages and subscribe to new ones
    useEffect(() => {
        if (!selected) return;

        supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", selected)
            .order("created_at", { ascending: true })
            .then(({ data }) => setMessages((data as Message[]) ?? []));

        const ch = supabase
            .channel(`admin-chat-${selected}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${selected}` },
                (p) => setMessages((m) => {
                    // Avoid duplicates (optimistic + realtime)
                    const exists = m.some((msg) => msg.id === (p.new as Message).id);
                    return exists ? m : [...m, p.new as Message];
                })
            )
            .subscribe();

        return () => { supabase.removeChannel(ch); };
    }, [selected]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSelectConversation = (id: string) => {
        setSelected(id);
        setShowMobileList(false);
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !selected || !user) return;
        setSending(true);
        const content = input.trim();
        setInput(""); // Clear immediately for better UX

        const { data: newMsg, error } = await supabase
            .from("messages")
            .insert({ conversation_id: selected, sender_id: user.id, content, is_admin: true })
            .select()
            .single();

        if (!error && newMsg) {
            // Optimistically add to state (realtime will dedupe)
            setMessages((m) => {
                const exists = m.some((msg) => msg.id === newMsg.id);
                return exists ? m : [...m, newMsg as Message];
            });

            // Push notification
            const conv = conversations.find((c) => c.id === selected);
            if (conv?.user_id) {
                fetch("/api/push", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: conv.user_id, message: `New message from Apex Truck Parts: ${content.slice(0, 80)}` }),
                }).catch(() => { });
            }
        } else if (error) {
            // Restore input if insert failed
            setInput(content);
        }
        setSending(false);
    };

    const selectedConv = conversations.find((c) => c.id === selected);

    return (
        <div className="flex h-[calc(100vh-56px)] lg:h-screen overflow-hidden relative bg-charcoal-900 font-sans">
            {/* ── Sidebar: Conversation List ── */}
            <div className={`
                ${showMobileList ? "flex" : "hidden"} 
                w-full lg:w-96 lg:flex border-r border-white/5 bg-charcoal-800 flex-col shrink-0
            `}>
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-xl font-black text-white uppercase tracking-tight">CUSTOMER <span className="text-amber-500">CHAT.</span></h1>
                        <p className="text-[10px] text-surface-200/20 font-black uppercase tracking-[0.2em] mt-1">Direct message center</p>
                    </div>
                    <button onClick={loadConversations} className="p-3 rounded-xl hover:bg-white/5 text-white/20 hover:text-amber-500 transition-colors" title="Refresh">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loadingConvs ? (
                        <div className="space-y-4 p-6">
                            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl bg-white/5" />)}
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="text-center py-20 text-white/10 px-6">
                            <MessageCircle className="w-16 h-16 mx-auto mb-6 opacity-10" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No active chats found.</p>
                        </div>
                    ) : (
                        conversations.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => handleSelectConversation(c.id)}
                                className={`w-full text-left px-8 py-6 border-b border-white/5 transition-all group ${selected === c.id
                                    ? "bg-amber-500/5 border-l-4 border-l-amber-500"
                                    : "hover:bg-white/[0.02] border-l-4 border-l-transparent"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${selected === c.id ? "bg-amber-500/10 border-amber-500/30" : "bg-charcoal-900 border-white/5 group-hover:border-white/10"}`}>
                                        <User className={`w-6 h-6 ${selected === c.id ? "text-amber-500" : "text-white/20"}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-sm font-black uppercase tracking-tight truncate ${selected === c.id ? "text-white" : "text-white/60"}`}>
                                            {c.userName || c.userEmail}
                                        </p>
                                        <p className="text-[10px] text-surface-200/20 font-black uppercase tracking-widest truncate mt-1">CHANNEL ID: {c.id.slice(0, 8)}</p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* ── Chat Area ── */}
            <div className={`
                ${!showMobileList ? "flex" : "hidden lg:flex"} 
                flex-1 flex flex-col min-w-0 bg-charcoal-950
            `}>
                {selected ? (
                    <>
                        {/* Header */}
                        <div className="px-8 py-5 border-b border-white/5 bg-charcoal-900/50 backdrop-blur-xl flex items-center gap-6">
                            <button
                                onClick={() => setShowMobileList(true)}
                                className="lg:hidden p-3 -ml-2 text-white/40 hover:text-amber-500 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-amber-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-black text-white text-lg uppercase tracking-tight truncate">
                                    {selectedConv?.userName || selectedConv?.userEmail || "Secure Client"}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[10px] text-surface-200/20 font-black uppercase tracking-widest truncate">{selectedConv?.userEmail}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-charcoal-900/40 via-transparent to-transparent">
                            {messages.length === 0 && (
                                <div className="text-center py-20 text-white/5">
                                    <MessageCircle className="w-16 h-16 mx-auto mb-6 opacity-10" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Establishing communication stream...</p>
                                </div>
                            )}
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.is_admin ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[85%] sm:max-w-[70%] px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-2xl ${msg.is_admin
                                        ? "bg-amber-500 text-charcoal-950 font-black rounded-br-none"
                                        : "bg-charcoal-800 border border-white/5 text-surface-50 rounded-bl-none"
                                        }`}>
                                        <p>{msg.content}</p>
                                        <p className={`text-[10px] mt-2 font-black uppercase tracking-widest opacity-40`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="px-8 py-6 border-t border-white/5 bg-charcoal-900/50 backdrop-blur-xl">
                            <form onSubmit={sendMessage} className="flex gap-4">
                                <div className="flex-1 relative">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Send a message..."
                                        className="w-full px-8 py-5 bg-charcoal-800 border border-white/5 rounded-[32px] text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-amber-500/30 transition-all font-medium"
                                    />
                                    <Zap className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/5" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={sending || !input.trim()}
                                    className="w-16 h-16 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-charcoal-950 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl shadow-amber-500/20 transition-all active:scale-95 group"
                                >
                                    <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent opacity-50" />
                        <div className="w-32 h-32 rounded-[48px] bg-charcoal-800 border border-white/5 flex items-center justify-center relative z-10 animate-bounce-slow">
                            <MessageCircle className="w-12 h-12 text-amber-500 opacity-20" />
                        </div>
                        <div className="relative z-10 max-w-sm">
                            <p className="font-display text-4xl font-black text-white uppercase tracking-tighter mb-4">CUSTOMER <span className="text-amber-500">CHAT.</span></p>
                            <p className="text-[10px] text-surface-200/20 font-black uppercase tracking-[0.3em] leading-loose">Select a customer to start chatting.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
