"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, PenTool as Tool, Truck, Star } from "lucide-react";

const stats = [
    { icon: Truck, value: "5000+", label: "Deliveries Made" },
    { icon: ShieldCheck, value: "100%", label: "Quality Inspected" },
    { icon: Star, value: "4.9★", label: "Fleet Rating" },
];

const TRUCK_PHOTOS = {
    hero: "/hero_truck.webp",
    inset: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80", // Modern truck part
};

export default function HomeHeroClient() {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-charcoal-950">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src={TRUCK_PHOTOS.hero}
                    alt="Apex Truck Parts Hero"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-900/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal-950" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col justify-center min-h-[90vh]">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-black uppercase tracking-[0.2em] mb-10 backdrop-blur-md border border-amber-500/20">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            Premium Hardware & Custom Flatbeds
                        </span>
                    </motion.div>

                    <motion.h1
                        className="font-display text-5xl sm:text-8xl lg:text-9xl font-black text-white mb-8 leading-[0.9] tracking-tighter"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        ENGINEERED FOR <br />
                        <span className="text-amber-500">THE ROAD.</span>
                    </motion.h1>

                    <motion.p
                        className="text-lg sm:text-xl text-surface-200/80 mb-12 leading-relaxed max-w-xl font-medium"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Apex Truck Parts delivers high-performance components and custom beds
                        built for maximum durability. Power your fleet with the hardware
                        that never quits.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap gap-5"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Link
                            href="/browse"
                            className="inline-flex items-center gap-4 px-10 py-5 bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-black uppercase tracking-widest rounded-2xl transition-all hover:shadow-2xl hover:shadow-amber-500/40 active:scale-95 text-lg"
                        >
                            Browse Inventory
                            <ArrowRight className="w-6 h-6" />
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-4 px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all text-lg"
                        >
                            Our Mission
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="flex flex-wrap gap-12 mt-20 pt-12 border-t border-white/5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        {stats.map(({ icon: Icon, value, label }) => (
                            <div key={label} className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:border-amber-500/30 transition-colors">
                                    <Icon className="w-7 h-7 text-amber-500" />
                                </div>
                                <div className="space-y-1">
                                    <div className="font-display font-black text-white text-2xl tracking-tight">{value}</div>
                                    <div className="text-[10px] text-surface-200/40 font-black uppercase tracking-[0.2em]">{label}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Inset photo floating far right - decorative */}
            <motion.div
                className="absolute top-1/2 -right-40 -translate-y-1/2 hidden 2xl:block z-10"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
            >
                <div className="w-[500px] h-[650px] rounded-[60px] overflow-hidden border-[16px] border-white/5 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] relative rotate-6 grayscale-0 hover:rotate-2 transition-transform duration-700">
                    <img
                        src={TRUCK_PHOTOS.inset}
                        alt="High-performance truck component"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 to-transparent" />
                </div>
            </motion.div>
        </section>
    );
}
