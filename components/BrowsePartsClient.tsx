"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import PartCard from "@/components/PartCard";
import { Search, SlidersHorizontal, Truck, Zap, ShieldCheck } from "lucide-react";

interface Part {
    id: string;
    name: string;
    model_year: string;
    category: string;
    price: number;
    status: string;
    images: string[];
    description?: string;
}

const statuses = ["all", "available", "reserved", "sold"];
const categories = [
    { id: "all", label: "All Units" },
    { id: "heavy-duty", label: "Heavy Duty" },
    { id: "performance", label: "Performance" }
];

export default function BrowsePuppiesClient() {
    const [parts, setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const fetchParts = useCallback(async () => {
        let query = supabase
            .from("parts")
            .select("id, name, model_year, category, price, status, images, description")
            .order("created_at", { ascending: false });

        if (statusFilter !== "all") query = query.eq("status", statusFilter);
        if (categoryFilter !== "all") query = query.eq("category", categoryFilter);

        const { data } = await query;
        setParts(data ?? []);
        setLoading(false);
    }, [statusFilter, categoryFilter]);

    useEffect(() => {
        fetchParts();
        const channel = supabase
            .channel("puppies-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "parts" },
                () => fetchParts()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchParts]);

    const filtered = parts.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-charcoal-900 min-h-screen">
            {/* Filters Bar */}
            <div className="sticky top-[72px] z-30 bg-charcoal-900/80 backdrop-blur-2xl border-b border-surface-200/5 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-6 items-center">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-200/40" />
                        <input
                            type="text"
                            placeholder="Search by part name or ID…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-charcoal-800 border border-surface-200/20 rounded-2xl text-surface-50 placeholder:text-surface-200/40 focus:outline-none focus:border-amber-500/50 focus:bg-white transition-all font-medium"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Status filter */}
                        <div className="flex items-center gap-1 bg-charcoal-800 border border-surface-200/20 rounded-2xl p-1.5 shadow-inner">
                            {statuses.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === s
                                        ? "bg-amber-500 text-charcoal-950 shadow-lg shadow-amber-500/20"
                                        : "text-surface-100 hover:text-surface-50 hover:bg-surface-200/5"
                                        }`}
                                >
                                    {s === 'all' ? 'All Stock' : s === 'available' ? 'In Stock' : s === 'reserved' ? 'Reserved' : 'Sold Out'}
                                </button>
                            ))}
                        </div>

                        {/* Category filter */}
                        <div className="flex items-center gap-1 bg-charcoal-800 border border-surface-200/20 rounded-2xl p-1.5 shadow-inner">
                            {categories.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setCategoryFilter(c.id)}
                                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${categoryFilter === c.id
                                        ? "bg-amber-500 text-charcoal-950 shadow-lg shadow-amber-500/20"
                                        : "text-surface-100 hover:text-surface-50 hover:bg-surface-200/5"
                                        }`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="skeleton rounded-[32px] h-[400px] bg-charcoal-800 border border-white/5" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-32 bg-charcoal-800 rounded-[48px] border border-surface-200/20 shadow-xl">
                        <div className="w-20 h-20 bg-charcoal-900 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-surface-200/10">
                            <Truck className="w-10 h-10 text-surface-200/20" />
                        </div>
                        <h3 className="font-display text-3xl font-black text-surface-50 mb-2 uppercase tracking-tight">Search Exhausted</h3>
                        <p className="text-surface-200 text-lg font-medium">No matching components found in current inventory.</p>
                        <button
                            onClick={() => { setSearch(""); setStatusFilter("all"); setCategoryFilter("all"); }}
                            className="mt-8 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-charcoal-950 text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                        >
                            Reset System Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-surface-200/5">
                            <p className="text-xs text-surface-200/40 font-black uppercase tracking-[0.2em]">
                                DISPATCHING {filtered.length} COMPONENT{filtered.length !== 1 ? "S" : ""}
                            </p>
                            <div className="flex items-center gap-2 text-amber-500">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Quality Inspected</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filtered.map((part) => (
                                <PartCard key={part.id} part={part} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
