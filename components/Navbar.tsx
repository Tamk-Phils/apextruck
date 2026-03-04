"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X, Settings, LogIn, LogOut, LayoutDashboard, MessageCircle, Truck, ShieldCheck, PenTool as Tool, ShoppingBag } from "lucide-react";
import { useAuth } from "@/lib/supabase/context";
import { useCart } from "@/lib/cart-context";

const resources = [
    { label: "Quality Guarantee", href: "/warranty" },
    { label: "How To", href: "/maintenance" },
    { label: "Shipping", href: "/shipping" },
    { label: "FAQ", href: "/faq" },
];

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Parts", href: "/browse" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, role, signOut } = useAuth();
    const { totalItems } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [resourcesOpen, setResourcesOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setResourcesOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-charcoal-950/95 backdrop-blur-md shadow-lg border-b border-white/5"
                : "bg-charcoal-950"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:bg-amber-600 transition-colors">
                            <Truck className="w-6 h-6 text-charcoal-950" />
                        </div>
                        <span className="font-display text-lg sm:text-xl font-bold text-surface-50 tracking-tight">
                            APEX<br />
                            <span className="text-amber-500 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">Truck Parts & Beds</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${pathname === link.href
                                    ? "text-amber-500 bg-white/5"
                                    : "text-surface-200 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Resources Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setResourcesOpen((o) => !o)}
                                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider text-surface-200 hover:text-white hover:bg-white/10 transition-all"
                            >
                                Guide
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {resourcesOpen && (
                                <div className="absolute top-full left-0 mt-2 w-56 bg-charcoal-800 border border-white/10 rounded-2xl shadow-2xl py-2 animate-fade-in overflow-hidden">
                                    {resources.map((r) => (
                                        <Link
                                            key={r.href}
                                            href={r.href}
                                            onClick={() => setResourcesOpen(false)}
                                            className="block px-4 py-2.5 text-sm font-medium text-surface-200 hover:text-amber-500 hover:bg-charcoal-900/50 transition-colors"
                                        >
                                            {r.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                {role === "admin" && (
                                    <Link
                                        href="/admin"
                                        className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-surface-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider text-surface-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Fleet
                                </Link>
                                <Link
                                    href="/chat"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider text-surface-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Chat
                                </Link>
                                <Link
                                    href="/cart"
                                    className="relative flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider text-surface-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Cart
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-charcoal-950 text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider text-surface-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-surface-100 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-white/10"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-2.5 text-sm font-black uppercase tracking-[0.1em] text-charcoal-950 bg-amber-500 hover:bg-amber-600 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileOpen((o) => !o)}
                        className="md:hidden p-3 rounded-xl text-white/40 hover:text-amber-500 hover:bg-white/5 transition-all"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                mobileOpen && (
                    <div className="md:hidden border-t border-white/5 bg-charcoal-950 animate-fade-in">
                        <div className="px-4 py-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${pathname === link.href
                                        ? "text-amber-500 bg-white/5"
                                        : "text-surface-200 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/5">
                                <p className="px-4 py-2 text-xs font-black text-white/30 uppercase tracking-[0.2em]">
                                    Resources
                                </p>
                                {resources.map((r) => (
                                    <Link
                                        key={r.href}
                                        href={r.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="block px-4 py-2.5 rounded-xl text-sm font-medium text-surface-200 hover:text-amber-500 hover:bg-white/5 transition-colors"
                                    >
                                        {r.label}
                                    </Link>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                {user ? (
                                    <div className="space-y-2">
                                        {role === "admin" && (
                                            <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold uppercase text-surface-200 hover:bg-white/5">Admin</Link>
                                        )}
                                        <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold uppercase text-surface-200 hover:bg-white/5">Fleet</Link>
                                        <Link href="/cart" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold uppercase text-surface-200 hover:bg-white/5 flex items-center justify-between">
                                            Cart
                                            {totalItems > 0 && <span className="bg-amber-500 text-charcoal-950 text-[10px] font-black px-2 py-0.5 rounded-full">{totalItems}</span>}
                                        </Link>
                                        <Link href="/chat" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold uppercase text-surface-200 hover:bg-white/5">Chat</Link>
                                        <button onClick={handleSignOut} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold uppercase text-surface-200 hover:bg-white/5">Sign out</button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold uppercase text-surface-200 border border-white/10">Sign In</Link>
                                        <Link href="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold uppercase text-charcoal-950 bg-amber-500">Get Started</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </header >
    );
}
