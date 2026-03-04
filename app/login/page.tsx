"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { ShieldCheck, LogIn } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
            setError(err.message);
            setLoading(false);
        } else {
            const role = data.user?.user_metadata?.role;
            if (role === "admin") {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        }
    };

    return (
        <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-6 border border-amber-500/20">
                        <ShieldCheck className="w-8 h-8 text-amber-500" />
                    </div>
                    <h1 className="font-display text-4xl font-black text-white mb-2 uppercase tracking-tighter">Command <span className="text-amber-500">Access.</span></h1>
                    <p className="text-surface-200/40 text-sm font-medium uppercase tracking-widest">Sign in to your Apex Industrial Account</p>
                </div>

                <div className="bg-charcoal-800 border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />

                    <form onSubmit={handleLogin} className="space-y-6 relative">
                        <div>
                            <label className="block text-[10px] font-black text-surface-200/30 uppercase tracking-[0.2em] mb-3 ml-1">Professional Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                className="w-full px-6 py-4 bg-charcoal-900 border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-amber-500/50 focus:bg-charcoal-950 transition-all placeholder:text-surface-200/20"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-3 ml-1">
                                <label className="block text-[10px] font-black text-surface-200/30 uppercase tracking-[0.2em]">Secure Password</label>
                                <Link href="/forgot-password" className="text-[10px] font-black text-amber-500/60 hover:text-amber-500 uppercase tracking-widest transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-6 py-4 bg-charcoal-900 border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-amber-500/50 focus:bg-charcoal-950 transition-all placeholder:text-surface-200/20"
                            />
                        </div>
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 font-bold uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-charcoal-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98] text-sm"
                        >
                            <LogIn className="w-5 h-5 fill-charcoal-950" />
                            {loading ? "AUTHENTICATING…" : "ACCESS DASHBOARD"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm mt-8 font-medium">
                    <span className="text-surface-200/30">Need an account?</span>{" "}
                    <Link href="/register" className="text-amber-500 font-black uppercase tracking-widest hover:text-amber-600 transition-colors ml-2">
                        Register Entity
                    </Link>
                </p>
            </div>
        </div>
    );
}
