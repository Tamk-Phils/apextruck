"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Truck, ClipboardList, Users, MessageCircle, Wrench, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface Stats {
    parts: number;
    requests: number;
    pending: number;
    users: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({ parts: 0, requests: 0, pending: 0, users: 0 });

    useEffect(() => {
        async function loadStats() {
            const [{ count: parts }, { count: orders }, { count: pending }, { count: users }] =
                await Promise.all([
                    supabase.from("parts").select("*", { count: "exact", head: true }),
                    supabase.from("orders").select("*", { count: "exact", head: true }),
                    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
                    supabase.from("users").select("*", { count: "exact", head: true }),
                ]);
            setStats({
                parts: parts ?? 0,
                requests: orders ?? 0,
                pending: pending ?? 0,
                users: users ?? 0,
            });
        }
        loadStats();
    }, []);

    const cards = [
        { icon: Truck, label: "Active Inventory", value: stats.parts, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
        { icon: ClipboardList, label: "Total Orders", value: stats.requests, color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
        { icon: ShieldCheck, label: "Pending Orders", value: stats.pending, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
        { icon: Users, label: "Total Users", value: stats.users, color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
    ];

    return (
        <div className="p-6 sm:p-10 bg-charcoal-900 min-h-screen font-sans">
            <header className="mb-12">
                <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter">
                    ADMIN <span className="text-amber-500">DASHBOARD.</span>
                </h1>
                <p className="text-surface-200/30 text-xs font-black uppercase tracking-[0.2em] mt-3">
                    Overview of your business
                </p>
            </header>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {cards.map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="bg-charcoal-800 border border-white/5 rounded-[32px] p-8 shadow-2xl group hover:border-amber-500/20 transition-all">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${color}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <p className="font-display text-4xl font-black text-white tracking-tighter">{value}</p>
                        <p className="text-[10px] font-black text-surface-200/20 uppercase tracking-[0.2em] mt-2 group-hover:text-surface-200/40 transition-colors">{label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-charcoal-800 border border-white/5 rounded-[40px] p-10 shadow-2xl">
                <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8">Quick Actions</h2>
                <div className="grid sm:grid-cols-3 gap-6">
                    {[
                        { href: "/admin/parts/new", label: "Add New Part", icon: Wrench, desc: "Add a new part to your inventory" },
                        { href: "/admin/requests", label: "Manage Orders", icon: ClipboardList, desc: "Process and view customer orders" },
                        { href: "/admin/chat", label: "Chat", icon: MessageCircle, desc: "Message your customers directly" },
                    ].map(({ href, label, icon: Icon, desc }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex flex-col gap-4 p-8 rounded-[32px] border border-white/5 bg-charcoal-900/50 hover:bg-charcoal-900 hover:border-amber-500/30 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500 group-hover:border-amber-500 transition-all">
                                <Icon className="w-5 h-5 text-amber-500 group-hover:text-charcoal-950 transition-all" />
                            </div>
                            <div>
                                <span className="text-xs font-black text-white uppercase tracking-widest block mb-1">{label}</span>
                                <span className="text-[10px] text-surface-200/30 uppercase tracking-tight">{desc}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
