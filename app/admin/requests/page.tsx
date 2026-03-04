"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { CheckCircle, XCircle, Clock, ChevronDown, Loader2, Truck, ClipboardList, ShieldCheck, MessageCircle } from "lucide-react";

interface Toast { message: string; type: "success" | "error" }

interface OrderItem {
    id: string;
    quantity: number;
    part: { name: string; images: string[] };
}

interface Order {
    id: string;
    status: string;
    created_at: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    payment_method: string;
    notes: string;
    user_id: string;
    total_price: number;
    order_items: OrderItem[];
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [toast, setToast] = useState<Toast | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        async function fetch() {
            let q = supabase.from("orders")
                .select("*, order_items(id, quantity, part:parts(name, images))")
                .order("created_at", { ascending: false });
            if (filter !== "all") q = q.eq("status", filter);
            const { data } = await q;
            setOrders((data as unknown as Order[]) ?? []);
            setLoading(false);
        }
        fetch();
    }, [filter]);

    const updateStatus = useCallback(async (id: string, status: string, userId: string, orderTitle: string) => {
        setProcessingId(id);
        const { error } = await supabase.from("orders").update({ status }).eq("id", id);
        if (error) {
            showToast(`Status update failed: ${error.message}`, "error");
            setProcessingId(null);
            return;
        }
        // Update local state immediately
        setOrders((reqs) => reqs.map((r) => r.id === id ? { ...r, status } : r));
        showToast(
            status === "approved" ? `✓ ${orderTitle} approved!` : `✕ ${orderTitle} declined`,
            status === "approved" ? "success" : "error"
        );
        // Best-effort: notify user in DB and push
        const msg = status === "approved"
            ? `🎉 Status Update: Your order for "${orderTitle}" has been approved! Please contact our admins through email or via the live chat to proceed with payment and delivery. Note: A refundable down payment is required.`
            : `Your order for "${orderTitle}" has been declined. Please contact our logistics team for clarification.`;
        await supabase.from("notifications").insert({ user_id: userId, message: msg, read: false });
        await fetch("/api/push", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, message: msg }),
        }).catch(() => {/* ignore push failures */ });
        setProcessingId(null);
    }, []);

    const statusIcon = (s: string) =>
        s === "approved" ? <CheckCircle className="w-5 h-5 text-emerald-500" /> :
            s === "rejected" ? <XCircle className="w-5 h-5 text-red-500" /> :
                <Clock className="w-5 h-5 text-amber-500" />;

    return (
        <div className="p-6 sm:p-10 bg-charcoal-900 min-h-screen font-sans">
            {toast && (
                <div className={`fixed top-8 right-8 z-[100] flex items-center gap-4 px-6 py-4 rounded-[20px] shadow-2xl text-sm font-black uppercase tracking-widest border animate-in slide-in-from-rightFade duration-300 ${toast.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : "bg-red-500/10 border-red-500/20 text-red-500"
                    }`}>
                    {toast.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                    {toast.message}
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter">
                        CUSTOMER <span className="text-amber-500">ORDERS.</span>
                    </h1>
                    <p className="text-surface-200/30 text-xs font-black uppercase tracking-[0.2em] mt-3">
                        Reviewing {orders.length} orders from the field
                    </p>
                </div>
                <div className="flex gap-2 bg-charcoal-800 border border-white/5 rounded-2xl p-1.5 shadow-xl shrink-0">
                    {["all", "pending", "approved", "rejected"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? "bg-amber-500 text-charcoal-950 shadow-lg" : "text-white/20 hover:text-white/40"}`}
                        >
                            {s === 'all' ? 'FULL LOG' : s}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-[32px] bg-charcoal-800 border border-white/5" />)}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-40 bg-charcoal-800 rounded-[48px] border border-white/5">
                    <ClipboardList className="w-20 h-20 mx-auto mb-8 opacity-10 text-white" />
                    <p className="font-display text-2xl font-black text-white/20 uppercase tracking-tight">Zero active orders matching current filter.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => {
                        const firstItem = order.order_items?.[0];
                        const itemCount = order.order_items?.length || 0;
                        const orderLabel = firstItem ? `${firstItem.part.name}${itemCount > 1 ? ` +${itemCount - 1}` : ''}` : "Multi-item Order";

                        return (
                            <details
                                key={order.id}
                                className="group bg-charcoal-800 border border-white/5 rounded-[32px] overflow-hidden transition-all hover:border-white/10"
                            >
                                <summary className="flex items-center gap-6 p-6 cursor-pointer list-none">
                                    <div className="w-16 h-16 rounded-2xl bg-charcoal-900 border border-white/5 overflow-hidden shrink-0">
                                        {firstItem?.part?.images?.[0]
                                            ? <img src={firstItem.part.images[0]} alt="" className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center bg-charcoal-900"><Truck className="w-8 h-8 text-white/10" /></div>}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-white text-lg tracking-tight uppercase group-hover:text-amber-500 transition-colors">
                                            {order.first_name} {order.last_name} → {orderLabel}
                                        </p>
                                        <p className="text-[10px] text-surface-200/20 font-black uppercase tracking-widest mt-1">
                                            {order.email} · TOTAL: ${order.total_price.toLocaleString()} · RECEIVED: {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-charcoal-900/50 px-6 py-3 rounded-2xl border border-white/5">
                                        {statusIcon(order.status)}
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{order.status}</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-open:rotate-180 transition-transform">
                                        <ChevronDown className="w-5 h-5 text-white/20" />
                                    </div>
                                </summary>
                                <div className="px-8 pb-8 border-t border-white/5 pt-8 space-y-8 bg-charcoal-900/20">
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {[
                                            { label: "Phone Number", value: order.phone, icon: ShieldCheck },
                                            { label: "Shipping Address", value: `${order.address}, ${order.city}, ${order.state} ${order.zip}`, icon: Truck },
                                            { label: "Payment Method", value: order.payment_method?.replace("_", " "), icon: ShieldCheck },
                                            { label: "Total Items", value: itemCount.toString(), icon: ClipboardList },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="space-y-2">
                                                <p className="text-[8px] text-white/10 font-black uppercase tracking-[0.2em]">{label}</p>
                                                <p className="text-xs text-surface-200/60 font-bold uppercase tracking-tight leading-relaxed">{value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[8px] text-white/10 font-black uppercase tracking-[0.2em]">Ordered Items</p>
                                        <div className="grid gap-3">
                                            {order.order_items?.map(it => (
                                                <div key={it.id} className="flex items-center justify-between p-4 bg-charcoal-900/40 border border-white/5 rounded-2xl">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-charcoal-800 overflow-hidden">
                                                            <img src={it.part.images[0]} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                        <p className="text-xs font-black text-white uppercase tracking-tight">{it.part.name}</p>
                                                    </div>
                                                    <p className="text-[10px] font-black text-amber-500 uppercase">QTY: {it.quantity}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {order.notes && (
                                        <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl">
                                            <p className="text-[8px] text-amber-500/40 font-black uppercase tracking-[0.2em] mb-3">Project Notes</p>
                                            <p className="text-sm text-surface-200/80 font-medium leading-relaxed">{order.notes}</p>
                                        </div>
                                    )}

                                    {order.status === "pending" && (
                                        <div className="flex gap-4 pt-4 border-t border-white/5">
                                            <button
                                                onClick={() => updateStatus(order.id, "approved", order.user_id, orderLabel)}
                                                disabled={processingId === order.id}
                                                className="flex-1 flex items-center justify-center gap-3 py-5 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:text-charcoal-950 text-emerald-500 font-black uppercase tracking-widest rounded-2xl text-xs transition-all disabled:opacity-50"
                                            >
                                                {processingId === order.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />} APPROVE ORDER
                                            </button>
                                            <button
                                                onClick={() => updateStatus(order.id, "rejected", order.user_id, orderLabel)}
                                                disabled={processingId === order.id}
                                                className="flex-1 flex items-center justify-center gap-3 py-5 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-500 font-black uppercase tracking-widest rounded-2xl text-xs transition-all disabled:opacity-50"
                                            >
                                                {processingId === order.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />} CANCEL ORDER
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </details>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
