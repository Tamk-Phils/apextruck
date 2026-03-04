"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/context";
import Link from "next/link";
import { ClipboardList, Bell, Truck, CheckCircle, XCircle, Clock, Package, ShieldCheck } from "lucide-react";

interface OrderItem {
    id: string;
    quantity: number;
    part: { name: string; images: string[] };
}

interface Order {
    id: string;
    status: string;
    created_at: string;
    total_price: number;
    shipping_status: string;
    order_items: OrderItem[];
}

interface Notification {
    id: string;
    message: string;
    read: boolean;
    created_at: string;
}

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [tab, setTab] = useState<"inquiries" | "alerts">("inquiries");

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    useEffect(() => {
        if (!user) return;

        async function fetchData() {
            const [{ data: reqs }, { data: notifs }] = await Promise.all([
                supabase
                    .from("orders")
                    .select("id, status, created_at, total_price, shipping_status, order_items(id, quantity, part:parts(name, images))")
                    .eq("user_id", user!.id)
                    .order("created_at", { ascending: false }),
                supabase
                    .from("notifications")
                    .select("id, message, read, created_at")
                    .eq("user_id", user!.id)
                    .order("created_at", { ascending: false })
                    .limit(20),
            ]);
            setOrders((reqs as unknown as Order[]) ?? []);
            setNotifications((notifs as Notification[]) ?? []);
        }
        fetchData();

        const channel = supabase
            .channel(`dashboard-${user.id}`)
            .on(
                "postgres_changes",
                { event: "*", filter: `user_id=eq.${user.id}`, schema: "public", table: "orders" },
                () => fetchData()
            )
            .on(
                "postgres_changes",
                { event: "*", filter: `user_id=eq.${user.id}`, schema: "public", table: "notifications" },
                () => fetchData()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const markRead = async (id: string) => {
        await supabase.from("notifications").update({ read: true }).eq("id", id);
        setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));
    };

    const statusIcon = (s: string) =>
        s === "approved" ? <CheckCircle className="w-5 h-5 text-emerald-500" /> :
            s === "rejected" ? <XCircle className="w-5 h-5 text-red-500" /> :
                <Clock className="w-5 h-5 text-amber-500" />;

    if (loading) return (
        <div className="min-h-screen bg-charcoal-900 flex items-center justify-center font-sans">
            <div className="w-16 h-16 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-charcoal-900 font-sans">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
                <div className="mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-black tracking-[0.3em] mb-4">
                        User Interface
                    </span>
                    <h1 className="font-display text-5xl font-black text-white mb-4 uppercase tracking-tighter">Command <span className="text-amber-500">Center.</span></h1>
                    <p className="text-surface-200/40 font-medium text-lg">Monitor your active unit inquiries and logistics updates.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-charcoal-800 border border-white/5 rounded-2xl p-1.5 w-fit mb-12 shadow-xl">
                    {(["inquiries", "alerts"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === t
                                ? "bg-amber-500 text-charcoal-950 shadow-lg shadow-amber-500/10"
                                : "text-surface-200/40 hover:text-white"
                                }`}
                        >
                            {t === "inquiries" ? <Package className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                            {t}
                            {t === "alerts" && notifications.filter((n) => !n.read).length > 0 && (
                                <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center shadow-lg">
                                    {notifications.filter((n) => !n.read).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {tab === "inquiries" ? (
                    orders.length === 0 ? (
                        <div className="text-center py-24 bg-charcoal-800 border border-white/5 rounded-[40px] shadow-2xl">
                            <Truck className="w-16 h-16 mx-auto mb-6 text-surface-200/10" />
                            <p className="text-xl font-black text-white uppercase tracking-tight mb-4">No Active Records</p>
                            <Link href="/browse" className="inline-flex items-center gap-2 text-amber-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-amber-400 transition-all">
                                [ Browse Industrial Inventory ]
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {orders.map((order) => {
                                const mainItem = order.order_items?.[0];
                                const extraCount = (order.order_items?.length ?? 0) - 1;

                                return (
                                    <div key={order.id} className="bg-charcoal-800 border border-white/5 rounded-[32px] p-6 flex flex-col sm:flex-row sm:items-center gap-6 group hover:border-amber-500/20 transition-all shadow-xl">
                                        <div className="flex items-center gap-6 flex-1">
                                            <div className="w-24 h-24 rounded-2xl bg-charcoal-900 border border-white/5 overflow-hidden shrink-0 group-hover:border-amber-500/30 transition-all relative">
                                                {mainItem?.part?.images?.[0] ? (
                                                    <img src={mainItem.part.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-8 h-8 text-surface-200/10" />
                                                    </div>
                                                )}
                                                {extraCount > 0 && (
                                                    <div className="absolute inset-0 bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                                                        <span className="text-white font-black text-xs">+{extraCount} More</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight truncate group-hover:text-amber-500 transition-colors">
                                                    {mainItem?.part?.name || "Order Request"}
                                                </h3>
                                                <p className="text-[10px] font-black text-surface-200/20 uppercase tracking-[0.2em] mt-2">
                                                    ID: {order.id.substring(0, 8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString()} · ${order.total_price.toLocaleString()}
                                                </p>
                                                <p className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest mt-1">
                                                    Logistics Stage: {order.shipping_status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 px-6 py-3 bg-charcoal-900 border border-white/5 rounded-2xl shadow-inner">
                                            {statusIcon(order.status)}
                                            <span className="text-xs font-black uppercase tracking-widest text-white">{order.status}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                ) : (
                    notifications.length === 0 ? (
                        <div className="text-center py-24 bg-charcoal-800 border border-white/5 rounded-[40px] shadow-2xl">
                            <Bell className="w-16 h-16 mx-auto mb-6 text-surface-200/10" />
                            <p className="text-xl font-black text-white uppercase tracking-tight">System Status Nominal</p>
                            <p className="text-surface-200/20 text-xs font-medium mt-2">Historical logs empty</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => !n.read && markRead(n.id)}
                                    className={`p-6 rounded-[24px] border cursor-pointer transition-all ${n.read
                                        ? "bg-charcoal-800/50 border-white/5 opacity-40"
                                        : "bg-charcoal-800 border-amber-500/20 hover:border-amber-500/40 shadow-xl"
                                        }`}
                                >
                                    <p className="text-sm text-white font-medium leading-relaxed">{n.message}</p>
                                    <p className="text-[10px] font-black text-surface-200/20 uppercase tracking-widest mt-4 flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        {new Date(n.created_at).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
