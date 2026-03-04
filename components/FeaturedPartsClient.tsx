"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import PartCard from "@/components/PartCard";
import { ArrowRight, Zap } from "lucide-react";

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

export default function FeaturedPartsClient() {
    const [parts, setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchParts() {
            const { data } = await supabase
                .from("parts")
                .select("id, name, model_year, category, price, status, images, description")
                .eq("status", "available")
                .order("created_at", { ascending: false })
                .limit(3);
            setParts(data ?? []);
            setLoading(false);
        }
        fetchParts();
    }, []);

    return (
        <section className="py-24 bg-charcoal-900 overflow-hidden relative">
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-16">
                    <motion.p
                        className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        Precision Stock
                    </motion.p>
                    <motion.h2
                        className="font-display text-4xl sm:text-6xl font-black text-surface-50 mb-6 uppercase tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Featured <span className="text-amber-500">Inventory</span>
                    </motion.h2>
                    <motion.p
                        className="text-surface-200 max-w-2xl mx-auto text-lg font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Engineered for endurance and performance. Explore our top-rated
                        hardware and custom fabrication solutions.
                    </motion.p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="skeleton rounded-[32px] h-[450px] bg-charcoal-800 border border-surface-200/5 shadow-2xl" />
                        ))}
                    </div>
                ) : parts.length === 0 ? (
                    <div className="text-center py-24 bg-charcoal-800 rounded-[40px] border border-surface-200/5 shadow-2xl">
                        <p className="text-xl font-bold text-surface-400 uppercase tracking-widest">Inventory Depleted</p>
                        <p className="text-sm text-surface-200/40 mt-2 font-medium">New precision components arriving daily.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {parts.map((part, i) => (
                            <motion.div
                                key={part.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <PartCard key={part.id} part={part} />
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-16">
                    <Link
                        href="/browse"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-charcoal-950 hover:bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl border border-white/5 transition-all active:scale-95 shadow-2xl"
                    >
                        View Full Catalog
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-amber-600" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
