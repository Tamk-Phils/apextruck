"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { ShieldCheck, KeyRound, CheckCircle } from "lucide-react";

function ResetForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const [checking, setChecking] = useState(true);
    const [sessionReady, setSessionReady] = useState(false);

    useEffect(() => {
        async function handleRecovery() {
            setChecking(true);
            const hash = window.location.hash;
            const code = searchParams.get("code");

            try {
                if (code) {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;
                    setSessionReady(true);
                }
                else if (hash.includes("access_token")) {
                    const params = new URLSearchParams(hash.substring(1));
                    const access_token = params.get("access_token");
                    const refresh_token = params.get("refresh_token");
                    if (access_token && refresh_token) {
                        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
                        if (error) throw error;
                        setSessionReady(true);
                    }
                }
                else {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session) setSessionReady(true);
                }
            } catch (err: any) {
                console.error("Auth recovery error:", err);
                setError("Verification failed. Protocol link invalid or expired.");
            } finally {
                setChecking(false);
            }
        }
        handleRecovery();
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setError("Session terminated! Request new restoration link.");
            return;
        }

        if (password !== confirm) { setError("Credential mismatch. Passwords must be identical."); return; }
        if (password.length < 8) { setError("Complexity error: Minimum 8 characters required."); return; }

        setLoading(true);
        setError("");

        const { error: err } = await supabase.auth.updateUser({ password });
        if (err) {
            setError(err.message);
            setLoading(false);
        } else {
            setDone(true);
            setTimeout(() => router.push("/login"), 3000);
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen bg-charcoal-900 flex items-center justify-center font-sans">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin mx-auto mb-8" />
                    <p className="text-surface-200/30 text-[10px] font-black uppercase tracking-[0.2em]">Authenticating Link…</p>
                </div>
            </div>
        );
    }

    if (!sessionReady && !done) {
        return (
            <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-4 font-sans">
                <div className="w-full max-w-md bg-charcoal-800 border border-white/5 rounded-[32px] p-10 text-center shadow-2xl">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-8 border border-red-500/20">
                        <KeyRound className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="font-display text-2xl font-black text-white mb-4 uppercase tracking-tight">Access Prohibited</h2>
                    <p className="text-surface-200/40 text-sm font-medium leading-relaxed mb-8">
                        The restoration security token is invalid, expired, or corrupted. Please request a new dispatch.
                    </p>
                    <Link href="/forgot-password"
                        className="inline-block px-10 py-4 bg-amber-500 text-charcoal-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20">
                        Request New Dispatch
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-6 border border-amber-500/20">
                        <ShieldCheck className="w-8 h-8 text-amber-500" />
                    </div>
                    <h1 className="font-display text-4xl font-black text-white mb-2 uppercase tracking-tighter">Secure <span className="text-amber-500">Overhaul.</span></h1>
                    <p className="text-surface-200/40 text-sm font-medium uppercase tracking-widest text-center">Update your Apex Industrial Credentials</p>
                </div>

                <div className="bg-charcoal-800 border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />

                    {done ? (
                        <div className="text-center py-6 relative">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-8 border border-emerald-500/20">
                                <CheckCircle className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h2 className="font-display text-2xl font-black text-white mb-4 uppercase tracking-tight">Credentials Verified</h2>
                            <p className="text-surface-200/40 text-sm font-medium leading-relaxed">Redirecting to primary access hub…</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 relative">
                            <div>
                                <label className="block text-[10px] font-black text-surface-200/30 uppercase tracking-[0.2em] mb-4 ml-1">New Secure Password</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-200/20" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        minLength={8}
                                        className="w-full pl-16 pr-6 py-4 bg-charcoal-900 border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-amber-500/50 focus:bg-charcoal-950 transition-all placeholder:text-surface-200/20"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-surface-200/30 uppercase tracking-[0.2em] mb-4 ml-1">Confirm New Credentials</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-200/20" />
                                    <input
                                        type="password"
                                        required
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-16 pr-6 py-4 bg-charcoal-900 border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-amber-500/50 focus:bg-charcoal-950 transition-all placeholder:text-surface-200/20"
                                    />
                                </div>
                            </div>
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 font-bold uppercase tracking-widest text-center">{error}</div>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-charcoal-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98] text-sm"
                            >
                                {loading ? "SYNCHRONIZING…" : "EXECUTE UPDATE"}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center mt-8 font-medium">
                    <Link href="/login" className="text-surface-200/30 hover:text-amber-500 font-black uppercase tracking-widest text-[10px] transition-all">Cancel and Return to Login</Link>
                </p>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetForm />
        </Suspense>
    );
}
