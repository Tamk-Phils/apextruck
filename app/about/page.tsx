import type { Metadata } from "next";
import { ShieldCheck, PenTool as Tool, Truck, Award, Gauge, Zap, Cog } from "lucide-react";

export const metadata: Metadata = {
    title: "About Apex Truck Parts & Beds",
    description: "Learn about the legacy of Apex Truck Parts — our engineering standards, our industrial roots, and our commitment to the road.",
};

const values = [
    { icon: ShieldCheck, title: "Industrial Warranty", desc: "Every component is backed by an industry-leading multi-year performance warranty." },
    { icon: Tool, title: "Precision Engineered", desc: "Our parts are manufactured to exact OEM specifications using high-grade steel." },
    { icon: Truck, title: "Heavy Duty Hardware", desc: "Built for the toughest environments, from construction sites to cross-country hauls." },
    { icon: Award, title: "Certified Quality", desc: "ISO 9001 certified manufacturing process ensuring consistent reliability." },
];

const IMAGES = {
    story: "/assets/restoration/workshop.png", // Restored High-end workshop
    item1: "https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=400&q=80", // Truck assembly
    item2: "/assets/restoration/shocks.png", // Restored Titan Shocks
    item3: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=80", // Heavy Truck
    gallery1: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=400&q=80", // Machining
    gallery2: "/assets/restoration/suspension.png", // Restored Suspension component
    gallery3: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=400&q=80", // Metal fabrication
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-charcoal-900">
            {/* Hero */}
            <section className="bg-charcoal-800 border-b border-surface-200/5 py-24 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-black tracking-[0.3em] mb-8">
                            Our Legacy
                        </span>
                        <h1 className="font-display text-5xl sm:text-7xl font-black text-surface-50 mb-8 leading-[0.9] tracking-tighter uppercase">
                            ENGINEERED FOR <br />
                            <span className="text-amber-500">STRENGTH.</span>
                        </h1>
                        <p className="text-lg text-surface-200/60 leading-relaxed font-medium">
                            Apex Truck Parts began in a small fabrication shop with a single goal:
                            to build truck components that actually last. Today, we are a leading
                            provider of heavy-duty hardware and custom beds for the industrial sector.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="rounded-[40px] overflow-hidden aspect-[4/3] shadow-2xl border border-surface-200/10 group">
                            <img src={IMAGES.story} alt="Apex Workshop" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-3xl overflow-hidden border-8 border-charcoal-800 shadow-2xl hidden xs:block">
                            <img src={IMAGES.gallery1} alt="Fabrication" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-32 max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-20 items-center">
                <div className="order-2 md:order-1">
                    <h2 className="font-display text-4xl font-black text-surface-50 mb-8 uppercase tracking-tight">The Apex Standard</h2>
                    <div className="space-y-6 text-surface-200/60 leading-relaxed font-medium text-lg">
                        <p>
                            Founded by master engineer Elias Bichon (formerly of European aerospace), Apex was
                            born from a necessity for better reliability in the heavy transport industry.
                            We saw too many components failing under standard loads.
                        </p>
                        <p>
                            After years of testing and refining our proprietary alloys and fabrication techniques,
                            Apex launched its current lineup of custom truck beds and performance hardware.
                            Every weld is inspected; every bolt is torqued to precision.
                        </p>
                        <p>
                            Today, every part that leaves our facility is certified for the most demanding
                            environments. We don&apos;t just sell parts — we sell the peace of mind that
                            your fleet will never let you down.
                        </p>
                    </div>
                </div>
                {/* Photo grid */}
                <div className="grid grid-cols-2 gap-4 order-1 md:order-2">
                    <div className="rounded-[32px] overflow-hidden h-56 col-span-2 border border-surface-200/5">
                        <img src={IMAGES.gallery2} alt="Suspension unit" className="w-full h-full object-cover" />
                    </div>
                    <div className="rounded-[24px] overflow-hidden h-44 border border-surface-200/5">
                        <img src={IMAGES.gallery1} alt="Precision gear" className="w-full h-full object-cover" />
                    </div>
                    <div className="rounded-[24px] overflow-hidden h-44 border border-surface-200/5">
                        <img src={IMAGES.gallery3} alt="Assembly line" className="w-full h-full object-cover" />
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-32 bg-charcoal-800 border-y border-surface-200/5 shadow-2xl">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-20">
                        <h2 className="font-display text-4xl font-black text-surface-50 mb-4 uppercase tracking-tight">
                            Core Engineering <span className="text-amber-500">Standards</span>
                        </h2>
                        <div className="w-24 h-1 bg-amber-500 mx-auto" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-charcoal-900 border border-surface-200/5 rounded-[32px] p-8 hover:border-amber-500/20 transition-all group shadow-xl">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20 group-hover:bg-amber-600 transition-all">
                                    <Icon className="w-7 h-7 text-amber-600 group-hover:text-charcoal-950 transition-all" />
                                </div>
                                <h3 className="font-display font-black text-surface-50 mb-4 uppercase tracking-wider">{title}</h3>
                                <p className="text-sm text-surface-200/60 leading-relaxed font-medium">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Inventory section */}
            <section className="py-32 max-w-6xl mx-auto px-4 sm:px-6 text-center">
                <h2 className="font-display text-4xl font-black text-surface-50 mb-6 uppercase tracking-tight">Core Inventory</h2>
                <p className="text-surface-200/60 mb-16 max-w-2xl mx-auto text-lg font-medium">
                    Our standard inventory consists of high-performance components certified for heavy-duty
                    applications across all major truck platforms.
                </p>
                <div className="grid sm:grid-cols-3 gap-8">
                    {[
                        { name: "AX-Series Bed", role: "Flatbed", img: IMAGES.item1 },
                        { name: "Titan Shocks", role: "Suspension", img: IMAGES.item2 },
                        { name: "DuraGear-9", role: "Transmission", img: IMAGES.item3 },
                    ].map(({ name, role, img }) => (
                        <div key={name} className="bg-charcoal-800 border border-surface-200/5 rounded-[40px] overflow-hidden group hover:border-amber-500/30 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                            <div className="h-64 bg-charcoal-900 overflow-hidden">
                                <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                            </div>
                            <div className="p-8">
                                <h3 className="font-display text-2xl font-black text-surface-50 uppercase tracking-tight">{name}</h3>
                                <p className="text-sm text-amber-600 font-bold uppercase tracking-widest mt-2">{role} · Performance Grade</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
