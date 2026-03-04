import { Metadata } from "next";
import { Truck, Package, ShieldCheck, MapPin, Globe, Zap, Clock } from "lucide-react";

export const metadata: Metadata = {
    title: "Shipping & Delivery",
    description: "Precision-timed logistics and dispatch protocols for Apex Truck Parts components.",
};

const options = [
    {
        icon: Truck,
        title: "LTL Freight",
        desc: "Standard Palletized shipping for heavy components and custom beds. Fully insured with lift-gate service included for most commercial zones.",
        price: "Calculated at Checkout",
    },
    {
        icon: Zap,
        title: "Expedited Logistics",
        desc: "Time-critical delivery via dedicated courier. Priority handling for urgent fleet repairs and mining operations. 24/7 technical support included.",
        price: "Premium Rate",
    },
    {
        icon: MapPin,
        title: "Warehouse Pickup",
        desc: "Direct collection from our regional fabrication facilities. Certified rigging equipment available for secure loading of heavy-duty chassis components.",
        price: "No Charge",
    },
];

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-charcoal-900 font-sans">
            <section className="bg-charcoal-800 border-b border-surface-200/5 py-24 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-amber-500/5 blur-[120px] rounded-full translate-y-1/2" />
                <div className="max-w-3xl mx-auto px-4 relative">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-black tracking-[0.3em] mb-8">
                        Shipping Center
                    </span>
                    <h1 className="font-display text-5xl sm:text-6xl font-black text-surface-50 mb-6 uppercase tracking-tighter">
                        Shipping & <br />
                        <span className="text-amber-500">Delivery.</span>
                    </h1>
                    <p className="text-surface-200/60 text-lg font-medium max-w-xl mx-auto">
                        Precision-timed delivery protocols for heavy-duty industrial components worldwide.
                    </p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 mb-20 relative z-10">
                <div className="relative aspect-[21/9] overflow-hidden rounded-[48px] border border-surface-200/10 shadow-3xl group">
                    <img
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
                        alt="Industrial Logistics Hub"
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 to-transparent" />
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {options.map(({ icon: Icon, title, desc, price }) => (
                        <div key={title} className="bg-charcoal-800 border border-surface-200/10 rounded-[40px] p-10 hover:border-amber-500/20 transition-all group shadow-xl">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-8 border border-amber-500/20 group-hover:bg-amber-500 transition-all">
                                <Icon className="w-7 h-7 text-amber-600 group-hover:text-charcoal-950 transition-all" />
                            </div>
                            <h2 className="font-display text-2xl font-black text-surface-50 mb-4 uppercase tracking-tight">{title}</h2>
                            <p className="text-surface-200 leading-relaxed mb-8 font-medium">{desc}</p>
                            <span className="text-amber-600 font-black text-xs uppercase tracking-widest">{price}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-charcoal-800 border border-surface-200/10 rounded-[48px] p-12 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full" />
                    <h2 className="font-display text-3xl font-black text-surface-50 mb-8 uppercase tracking-tight flex items-center gap-4">
                        <Globe className="w-8 h-8 text-amber-600" />
                        How we ship
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-12">
                        <ul className="space-y-6">
                            {[
                                "Certified multi-point integrity inspection prior to crate sealing.",
                                "Custom reinforced industrial packaging designed for heavy-duty alloys.",
                                "Real-time GPS telemetry and vibration sensor monitoring during transit.",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-surface-200 font-medium text-lg">
                                    <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <ul className="space-y-6">
                            {[
                                "Direct technical coordination with fleet receiving managers.",
                                "Standardized documentation including ISO certifications and CAD reports.",
                                "Zero-tolerance damage protocol with immediate replacement priority.",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-surface-200 font-medium text-lg">
                                    <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
