"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Truck, CheckCircle, XCircle, Zap, ShieldCheck, Scale, Cog } from "lucide-react";

interface Part {
    id: string;
    name: string;
    model_year: string;
    category: string;
    price: number;
    status: string;
    images: string[];
}

interface Toast { message: string; type: "success" | "error" }

export default function AdminParts() {
    const router = useRouter();
    const [parts, setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [toast, setToast] = useState<Toast | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchParts = useCallback(async () => {
        const { data, error } = await supabase.from("parts").select("*").order("created_at", { ascending: false });
        if (error) {
            showToast("Failed to load inventory: " + error.message, "error");
        } else {
            setParts((data as Part[]) ?? []);
        }
        setLoading(false);
    }, []);

    useEffect(() => { fetchParts(); }, [fetchParts]);

    const deletePart = async (id: string, name: string) => {
        if (!confirm(`Permanently delete part "${name}" from inventory?`)) return;
        setDeletingId(id);
        const { error } = await supabase.from("parts").delete().eq("id", id);
        setDeletingId(null);
        if (error) {
            showToast(`Deletion failed for ${name}: ${error.message}`, "error");
        } else {
            setParts((p) => p.filter((x) => x.id !== id));
            showToast(`${name} removed from inventory.`, "success");
        }
    };

    const statusColor = (s: string) =>
        s === "available" ? "border-emerald-500/20 text-emerald-600 bg-emerald-500/5" :
            s === "reserved" ? "border-amber-500/20 text-amber-600 bg-amber-500/5" :
                "border-red-500/20 text-red-600 bg-red-500/5";

    return (
        <div className="p-6 sm:p-10 bg-charcoal-900 min-h-screen font-sans">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-8 right-8 z-[100] flex items-center gap-4 px-6 py-4 rounded-[20px] shadow-2xl text-sm font-black uppercase tracking-widest border animate-in slide-in-from-rightFade duration-300 ${toast.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : "bg-red-500/10 border-red-500/20 text-red-500"
                    }`}>
                    {toast.type === "success"
                        ? <CheckCircle className="w-5 h-5 shrink-0" />
                        : <XCircle className="w-5 h-5 shrink-0" />}
                    {toast.message}
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="font-display text-4xl sm:text-5xl font-black text-surface-50 uppercase tracking-tighter">
                        INVENTORY <span className="text-amber-500">MANAGEMENT.</span>
                    </h1>
                    <p className="text-surface-200/40 text-xs font-black uppercase tracking-[0.2em] mt-3">
                        {parts.length} PARTS CURRENTLY IN STOCK
                    </p>
                </div>
                <Link
                    href="/admin/parts/new"
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-black uppercase tracking-widest rounded-2xl text-xs transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98]"
                >
                    <Plus className="w-4 h-4" /> ADD NEW PART
                </Link>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-3xl bg-charcoal-800 border border-white/5" />)}
                </div>
            ) : parts.length === 0 ? (
                <div className="text-center py-32 bg-charcoal-800 border border-surface-200/10 rounded-[48px] shadow-2xl">
                    <Truck className="w-20 h-20 mx-auto mb-8 opacity-10 text-surface-200/20" />
                    <p className="font-display text-2xl font-black text-surface-200/20 uppercase tracking-tight">No parts found.</p>
                    <Link href="/admin/parts/new" className="inline-block mt-8 px-8 py-4 bg-amber-500 text-charcoal-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all">
                        Create First Listing
                    </Link>
                </div>
            ) : (
                <div className="bg-charcoal-800 border border-surface-200/5 rounded-[40px] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-charcoal-900 border-b border-surface-200/5">
                                <tr>
                                    {["Part Name", "Year", "Category", "Price", "Status", "Actions"].map((h) => (
                                        <th key={h} className="px-8 py-6 text-left text-[10px] font-black text-surface-200/20 uppercase tracking-[0.2em]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-200/5">
                                {parts.map((p) => (
                                    <tr key={p.id} className="hover:bg-charcoal-900 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-charcoal-800 border border-surface-200/5 overflow-hidden shrink-0">
                                                    {p.images?.[0]
                                                        ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                                        : <div className="w-full h-full flex items-center justify-center"><Truck className="w-6 h-6 text-surface-200/10" /></div>
                                                    }
                                                </div>
                                                <span className="font-bold text-surface-50 text-lg tracking-tight group-hover:text-amber-600 transition-colors uppercase">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-surface-200/30 uppercase tracking-widest">{p.model_year}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-surface-200/30 font-bold uppercase tracking-widest text-[10px]">
                                                {p.category === 'heavy-duty' ? <Scale className="w-3.5 h-3.5 text-amber-500" /> : <Zap className="w-3.5 h-3.5 text-amber-500" />}
                                                {p.category === 'heavy-duty' ? 'Heavy Duty' : 'Performance'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-lg font-black text-surface-50 tracking-tighter">${p.price?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${statusColor(p.status)}`}>
                                                {p.status === 'available' ? 'In Stock' : p.status === 'reserved' ? 'On Hold' : 'Sold Out'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/admin/parts/edit/${p.id}`)}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-charcoal-950 hover:bg-slate-900 text-white transition-all border border-white/5"
                                                    title="Edit details"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => deletePart(p.id, p.name)}
                                                    disabled={deletingId === p.id}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white transition-all border border-red-500/20 disabled:opacity-50"
                                                    title="Delete item"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    {deletingId === p.id ? "DELETING…" : "Delete"}
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
