"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { ShieldCheck, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (err) {
            setError(err.message);
            setLoading(false);
        } else {
            setSent(true);
        }
    };

    return (
        <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-6 border border-amber-500/20">
                        <ShieldCheck className="w-8 h-8 text-amber-500" />
                    </div>
                    <h1 className="font-display text-4xl font-black text-white mb-2 uppercase tracking-tighter">Identity <span className="text-amber-500">Recovery.</span></h1>
                    <p className="text-surface-200/40 text-sm font-medium uppercase tracking-widest">
                        Industrial credentials restoration portal
                    </p>
                </div>

                <div className="bg-charcoal-800 border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />

                    {sent ? (
                        <div className="text-center py-6 relative">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-8 border border-emerald-500/20">
                                <CheckCircle className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h2 className="font-display text-2xl font-black text-white mb-4 uppercase tracking-tight">Transmission Sent</h2>
                            <p className="text-surface-200/40 text-sm font-medium leading-relaxed mb-8">
                                Password restoration protocols sent to <strong>{email}</strong>.
                                Check your encrypted inbox.
                            </p>
                            <p className="text-[10px] text-surface-200/20 font-black uppercase tracking-[0.2em]">
                                No dispatch received? Contact{" "}
                                <a href="mailto:support@apextruckparts.com" className="text-amber-500">
                                    APEX SUPPORT
                                </a>
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 relative">
                            <div>
                                <label className="block text-[10px] font-black text-surface-200/30 uppercase tracking-[0.2em] mb-4 ml-1">
                                    Registered Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-200/20" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        className="w-full pl-16 pr-6 py-4 bg-charcoal-900 border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-amber-500/50 focus:bg-charcoal-950 transition-all placeholder:text-surface-200/20"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 font-bold uppercase tracking-widest text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-charcoal-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98] text-sm"
                            >
                                {loading ? "INITIALIZING…" : "DISPATCH RESET LINK"}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center mt-8 font-medium">
                    <Link href="/login" className="inline-flex items-center gap-2 text-surface-200/30 hover:text-amber-500 font-black uppercase tracking-widest text-[10px] transition-all">
                        <ArrowLeft className="w-4 h-4" /> Return to Access Control
                    </Link>
                </p>
            </div>
        </div>
    );
}
