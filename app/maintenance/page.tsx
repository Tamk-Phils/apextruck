import type { Metadata } from "next";
import { Wrench, Settings, BookOpen, Activity, Construction } from "lucide-react";

export const metadata: Metadata = {
    title: "Maintenance & Installation | Apex Truck Parts",
    description: "Technical guides for professional installation and long-term maintenance of Apex truck components.",
};

const sections = [
    {
        icon: Wrench,
        title: "Installation Protocols",
        content: [
            "All Apex flatbeds and chassis components require professional installation by a certified commercial vehicle technician.",
            "Verify all mounting points and electrical headers for debris or oxidation before beginning the assembly process.",
            "Torque all structural bolts to precisely 180 lb-ft unless specified otherwise in your unit-specific technical manual.",
        ],
    },
    {
        icon: Settings,
        title: "System Integration",
        content: [
            "Electronic modules must be flashed with the latest Apex firmware (v1.4+) to ensure full compatibility with OEM sensors.",
            "Check hydraulic line pressure after first 50 miles of operation. System should maintain a constant 3,200 PSI under load.",
            "Calibration of load sensors is required annually to maintain the integrity of our onboard weighing systems.",
        ],
    },
    {
        icon: BookOpen,
        title: "Technical Documentation",
        content: [
            "Access full schematics and wiring diagrams for your specific model year in the Client Dashboard under 'Technical Library'.",
            "Use only certified high-tensile steel fasteners (Grade 8.8 or higher) for all structural mountings to maintain warranty.",
            "Performance tiers for each component are optimized for specific GVWR ratings — do not exceed these specifications.",
        ],
    },
    {
        icon: Activity,
        title: "Lifecycle Maintenance",
        content: [
            "Schedule structural integrity inspections every 15,000 miles or 500 operating hours, whichever occurs first.",
            "Inspect all poly-bushings and pivot points for wear. Lubricate monthly with high-performance lithium grease.",
            "Monitor for stress fractures in high-load areas, particularly after heavy off-road or construction site deployment.",
        ],
    },
];

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-charcoal-900 font-sans pt-32 pb-24">
            <section className="text-center mb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-8">
                        <Construction className="w-8 h-8 text-amber-500" />
                    </div>
                    <h1 className="font-display text-5xl sm:text-7xl font-black text-surface-50 mb-6 uppercase tracking-tighter">
                        TECHNICAL <span className="text-amber-500">GUIDES.</span>
                    </h1>
                    <p className="text-surface-200 font-medium leading-relaxed uppercase tracking-widest text-[10px] sm:text-sm">
                        Professional Maintenance and Installation Protocols.
                    </p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24">
                <div className="relative aspect-[21/9] overflow-hidden rounded-[40px] border border-surface-200/10 shadow-2xl bg-charcoal-800">
                    <img
                        src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
                        alt="Heavy Duty Maintenance"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-transparent" />
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
                {sections.map(({ icon: Icon, title, content }) => (
                    <div key={title} className="bg-charcoal-800 border border-surface-200/10 rounded-[40px] p-10 shadow-2xl group hover:border-amber-500/20 transition-all">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/10 group-hover:bg-amber-500 group-hover:text-charcoal-900 transition-all">
                                <Icon className="w-7 h-7 text-amber-600 group-hover:text-charcoal-950 transition-all" />
                            </div>
                            <h2 className="font-display text-3xl font-black text-surface-50 uppercase tracking-tight">{title}</h2>
                        </div>
                        <div className="grid gap-4">
                            {content.map((item, i) => (
                                <div key={i} className="flex gap-6 p-6 bg-charcoal-900/40 rounded-2xl border border-surface-200/5 group-hover:border-surface-200/10 transition-all">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 text-xs flex items-center justify-center font-black shrink-0 mt-0.5 border border-amber-500/20">
                                        {i + 1}
                                    </div>
                                    <p className="text-surface-200 leading-relaxed font-medium">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
