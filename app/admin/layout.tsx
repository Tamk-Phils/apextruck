"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/supabase/context";
import { supabase } from "@/lib/supabase/client";
import {
    LayoutDashboard, Truck, ClipboardList, MessageCircle, Users, LogOut, Home, Menu, X, ShieldCheck, Settings, Wrench
} from "lucide-react";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/parts", label: "Inventory", icon: Truck },
    { href: "/admin/requests", label: "Orders", icon: ClipboardList },
    { href: "/admin/chat", label: "Chat", icon: MessageCircle },
    { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, role, loading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!user || role !== "admin")) {
            router.replace("/login");
        }
    }, [user, role, loading, router]);

    // Close sidebar on navigation
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    // Guarantee admin's row exists in public.users
    useEffect(() => {
        if (user && role === "admin") {
            supabase
                .from("users")
                .upsert(
                    { id: user.id, email: user.email ?? "", role: "admin" },
                    { onConflict: "id" }
                )
                .then(() => { /* best effort */ });
        }
    }, [user, role]);

    if (loading || !user || role !== "admin") {
        return (
            <div className="min-h-screen bg-charcoal-900 flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-200">Loading...</span>
                </div>
            </div>
        );
    }

    const NavContent = () => (
        <div className="flex flex-col h-full bg-charcoal-900 border-r border-white/5">
            <div className="px-8 py-8 border-b border-white/5">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-charcoal-900" />
                    </div>
                    <span className="font-display text-white font-black text-lg uppercase tracking-tighter leading-none">
                        APEX <span className="text-amber-500">TRUCK.</span>
                    </span>
                </div>
                <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">ADMIN PORTAL</span>
            </div>
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map(({ href, label, icon: Icon, exact }) => {
                    const active = exact ? pathname === href : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${active
                                ? "bg-amber-500 text-charcoal-950 shadow-lg shadow-amber-500/10"
                                : "text-white/20 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${active ? "text-charcoal-950" : "text-amber-500/40"}`} />
                            {label}
                        </Link>
                    );
                })}
            </nav>
            <div className="px-4 pb-8 space-y-2 border-t border-white/5 pt-6">
                <Link href="/" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white hover:bg-white/5 transition-all">
                    <Home className="w-4 h-4" /> View Main Site
                </Link>
                <button onClick={signOut} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all">
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-charcoal-900 flex flex-col lg:flex-row font-sans">
            {/* Mobile Header */}
            <header className="lg:hidden bg-charcoal-900 border-b border-white/5 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-amber-500" />
                    <span className="font-display font-black text-sm uppercase tracking-tighter">APEX ADMIN</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-3 -mr-3 text-white/20 hover:text-amber-500 transition-colors"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-charcoal-950/80 backdrop-blur-md z-40 animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar (Desktop & Mobile Drawer) */}
            <aside className={`
                w-80 shrink-0 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0
                ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
                lg:static lg:h-screen
            `}>
                <NavContent />
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0 h-screen overflow-y-auto custom-scrollbar relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/[0.02] via-transparent to-transparent pointer-events-none" />
                {children}
            </main>
        </div>
    );
}
