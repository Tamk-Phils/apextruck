"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Shield, ShieldOff, UserCog, Trash2, ShieldCheck, Search, Users } from "lucide-react";

interface AppUser {
    id: string;
    email: string;
    name?: string;
    role: string;
    created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.from("users").select("*").order("created_at", { ascending: false }).then(({ data }) => {
            setUsers((data as AppUser[]) ?? []);
            setLoading(false);
        });
    }, []);

    const toggleRole = async (id: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        await supabase.from("users").update({ role: newRole }).eq("id", id);
        setUsers((u) => u.map((x) => (x.id === id ? { ...x, role: newRole } : x)));
    };

    const deleteUser = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to permanently delete user ${email}? This cannot be undone.`)) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch("/api/delete-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ userId: id }),
            });

            const result = await res.json();
            if (result.success) {
                setUsers((u) => u.filter((x) => x.id !== id));
                alert("User deleted successfully.");
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (err) {
            console.error("Failed to delete user:", err);
            alert("Failed to delete user.");
        }
    };

    return (
        <div className="p-6 sm:p-10 bg-charcoal-900 min-h-screen font-sans">
            <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter">
                        USER <span className="text-amber-500">LIST.</span>
                    </h1>
                    <p className="text-surface-200/30 text-xs font-black uppercase tracking-[0.2em] mt-3">
                        Manage users and permissions
                    </p>
                </div>
                <div className="bg-charcoal-800 border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-4 text-white/20">
                    <Users className="w-5 h-5" />
                    <span className="text-xl font-black text-white tracking-tighter">{users.length}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest ml-1">Total Users</span>
                </div>
            </header>

            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-[32px] bg-charcoal-800 border border-white/5" />)}
                </div>
            ) : (
                <div className="bg-charcoal-800 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full min-w-[800px] border-collapse">
                            <thead>
                                <tr className="bg-charcoal-900/50 border-b border-white/5">
                                    {["Name", "Email Address", "Type", "Joined", "Actions"].map((h) => (
                                        <th key={h} className="px-8 py-6 text-left text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-charcoal-900 border border-white/5 flex items-center justify-center">
                                                    <UserCog className="w-5 h-5 text-white/20 group-hover:text-amber-500 transition-colors" />
                                                </div>
                                                <span className="text-sm font-bold text-white uppercase tracking-tight">{u.name || "UNIDENTIFIED"}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-surface-200/40 font-medium">{u.email}</td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-2 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${u.role === "admin"
                                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                : "bg-white/5 text-white/40 border border-white/5"
                                                }`}>
                                                {u.role === "admin" && <ShieldCheck className="w-3.5 h-3.5" />}
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-xs text-surface-200/20 font-black uppercase tracking-widest">{new Date(u.created_at).toLocaleDateString()}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleRole(u.id, u.role)}
                                                    className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black px-5 py-3 rounded-2xl border border-white/5 bg-charcoal-900/50 hover:bg-white/10 text-white/40 hover:text-white transition-all uppercase tracking-widest"
                                                >
                                                    {u.role === "admin" ? <><ShieldOff className="w-4 h-4 text-red-500/50" /> REMOVE ADMIN</> : <><ShieldCheck className="w-4 h-4 text-amber-500/50" /> MAKE ADMIN</>}
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(u.id, u.email)}
                                                    className="w-11 h-11 flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
