"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/context";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, ShieldCheck, MessageCircle, Shield, ChevronLeft, ChevronRight, Truck, Zap, Cog, Scale, ShoppingCart, CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

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

export default function PartDetailsClient() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [part, setPart] = useState<Part | null>(null);
    const [added, setAdded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imgIdx, setImgIdx] = useState(0);

    useEffect(() => {
        async function fetch() {
            const { data } = await supabase
                .from("parts")
                .select("*")
                .eq("id", id)
                .single();
            setPart(data);
            setLoading(false);
        }
        fetch();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 grid lg:grid-cols-2 gap-20">
                <div className="skeleton rounded-[48px] h-[600px] bg-charcoal-800" />
                <div className="space-y-8">
                    <div className="skeleton rounded-2xl h-16 w-3/4 bg-charcoal-800" />
                    <div className="skeleton rounded-2xl h-40 bg-charcoal-800" />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="skeleton rounded-2xl h-20 bg-charcoal-800" />
                    ))}
                </div>
            </div>
        );
    }
    if (!part) {
        return (
            <div className="text-center py-40 bg-charcoal-900 min-h-screen">
                <div className="w-24 h-24 bg-charcoal-800 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                    <Truck className="w-12 h-12 text-white/10" />
                </div>
                <h3 className="font-display text-4xl font-black text-white mb-4 uppercase tracking-tight">Component Not Found</h3>
                <Link href="/browse" className="text-amber-500 font-black uppercase tracking-widest text-xs hover:text-amber-400 transition-colors">
                    Back to Catalog
                </Link>
            </div>
        );
    }

    const images = part.images ?? [];
    const statusColor =
        part.status === "available" ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5" :
            part.status === "reserved" ? "border-amber-500/20 text-amber-500 bg-amber-500/5" :
                "border-red-500/20 text-red-500 bg-red-500/5";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": part.name,
        "description": part.description,
        "image": images,
        "offers": {
            "@type": "Offer",
            "price": part.price,
            "priceCurrency": "USD",
            "availability": part.status === "available"
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock"
        },
        "brand": {
            "@type": "Brand",
            "name": "Apex Truck Parts & Beds"
        }
    };

    return (
        <div className="min-h-screen bg-charcoal-900 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <Link
                    href="/browse"
                    className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-amber-500 transition-all mb-12"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Return to Inventory
                </Link>

                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    {/* Image gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="sticky top-32"
                    >
                        <div className="relative rounded-[32px] overflow-hidden bg-charcoal-950 border border-white/5 aspect-square sm:h-[600px] lg:h-[650px] shadow-2xl">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={imgIdx}
                                    src={images[imgIdx]}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5 }}
                                    alt={`${part.name} view ${imgIdx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>

                            {images.length > 1 && (
                                <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
                                    <button
                                        onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                                        className="w-14 h-14 rounded-full bg-charcoal-900/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-amber-500 hover:border-amber-500 transition-all pointer-events-auto group shadow-xl"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-white group-hover:text-charcoal-900" />
                                    </button>
                                    <button
                                        onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                                        className="w-14 h-14 rounded-full bg-charcoal-900/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-amber-500 hover:border-amber-500 transition-all pointer-events-auto group shadow-xl"
                                    >
                                        <ChevronRight className="w-6 h-6 text-white group-hover:text-charcoal-900" />
                                    </button>
                                </div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-4 mt-6">
                                {images.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setImgIdx(i)}
                                        className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-charcoal-800 ${i === imgIdx ? "border-amber-500 opacity-100" : "border-white/5 opacity-40 hover:opacity-80"
                                            }`}
                                    >
                                        <img src={src} alt="" className="w-full h-full object-cover rounded-xl" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="space-y-10"
                    >
                        <div>
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className={`inline-block px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${statusColor}`}>
                                    {part.status === 'available' ? 'Ready for Dispatch' : part.status === 'reserved' ? 'On Hold' : 'Unavailable'}
                                </span>
                                <span className="flex items-center gap-2 text-surface-200/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                                    Certified Component
                                </span>
                            </div>
                            <h1 className="font-display text-5xl sm:text-7xl font-black text-white mb-4 uppercase tracking-tighter leading-none">
                                {part.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-surface-200/30">
                                <span className="flex items-center gap-2 text-amber-500">
                                    {part.category === 'heavy-duty' ? <Scale className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                                    {part.category === 'heavy-duty' ? 'Heavy Duty' : 'Performance Tier'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Model Year: {part.model_year}
                                </span>
                                <span>MFG: APEX INDUSTRIAL</span>
                            </div>
                        </div>

                        {part.description && (
                            <div className="prose prose-invert max-w-none">
                                <p className="text-surface-200/50 text-xl font-medium leading-relaxed">
                                    {part.description}
                                </p>
                            </div>
                        )}

                        <div className="bg-charcoal-800 border-y border-white/5 py-10 px-0 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full group-hover:bg-amber-500/10 transition-all" />
                            <p className="text-[10px] font-black text-surface-200/20 uppercase tracking-[0.3em] mb-4">Industrial Procurement Specification</p>
                            <div className="flex items-baseline gap-4">
                                <p className="font-display text-7xl font-black text-white tracking-tighter">
                                    ${part.price?.toLocaleString()}
                                </p>
                                <span className="text-xl text-amber-500 font-bold uppercase tracking-widest">USD</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { icon: Shield, label: "5-Year Structural Warranty" },
                                { icon: Cog, label: "Precision Fitment" },
                                { icon: Truck, label: "Global Logistics" },
                                { icon: ShieldCheck, label: "ISO Certified" },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="bg-charcoal-950/50 border border-white/5 rounded-2xl p-6 text-center group hover:border-amber-500/20 transition-all">
                                    <Icon className="w-5 h-5 text-amber-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                    <p className="text-[8px] text-surface-200/40 font-black uppercase tracking-widest leading-tight">{label}</p>
                                </div>
                            ))}
                        </div>

                        {part.status === "available" ? (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => {
                                        addToCart({
                                            id: part.id,
                                            name: part.name,
                                            price: part.price || 0,
                                            image: images[0] || "",
                                        });
                                        setAdded(true);
                                        setTimeout(() => setAdded(false), 2000);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-3 py-6 bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl shadow-amber-500/20 text-lg active:scale-[0.98]"
                                >
                                    {added ? (
                                        <>
                                            <CheckCircle2 className="w-6 h-6" />
                                            Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-6 h-6" />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                                <Link
                                    href="/chat"
                                    className="flex items-center justify-center gap-3 px-8 py-6 border border-white/10 text-white font-black uppercase tracking-widest rounded-3xl hover:bg-white/5 transition-all text-sm"
                                >
                                    <MessageCircle className="w-5 h-5 text-amber-500" /> Engineer Chat
                                </Link>
                            </div>
                        ) : (
                            <div className="p-10 bg-white/5 border border-white/5 rounded-[40px] text-center">
                                <p className="font-display text-2xl font-black text-white/20 uppercase tracking-tight mb-6">Unit Fully Committed</p>
                                <Link href="/browse" className="inline-block px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all">
                                    Search Next Shipment
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
