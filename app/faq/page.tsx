import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
    title: "FAQ",
    description: "Frequently asked inquiries regarding unit procurement, industrial specifications, and logistics at Apex Truck Parts.",
};

const faqs = [
    {
        q: "How do I initiate a bulk unit procurement?",
        a: "Browse our inventory, select the components required for your fleet, and submit a formal inquiry. Our logistics team will review the specifications and provide a certified quote within 24 hours.",
    },
    {
        q: "What is included in the Apex Certification?",
        a: "Every part undergoes a 40-point stress test, material integrity analysis, and OEM specification verification. All units include a hard-copy certification report and installation hardware.",
    },
    {
        q: "Do you provide multi-year performance warranties?",
        a: "Yes. We offer a standard 2-year industrial warranty on all structural components, covering material defects and performance degradation under standard operational loads.",
    },
    {
        q: "What are the available logistics options?",
        a: "We offer LTL Freight, Expedited Ground, and Warehouse Pickup. All high-value shipments are tracked via real-time GPS and require signature verification from a certified receiver.",
    },
    {
        q: "Are the truck beds compatible with all major chassis?",
        a: "Our AX-Series beds are engineered for universal compatibility with Class 4-7 chassis. Custom mounting brackets are available for specialized vocational applications.",
    },
    {
        q: "How are technical specifications verified?",
        a: "Each part is laser-scanned and measured against CAD models to ensure 0.01mm tolerance precision before being cleared for dispatch from our facility.",
    },
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-charcoal-900 font-sans">
            <section className="bg-charcoal-800 border-b border-surface-200/5 py-24 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-amber-500/5 blur-[120px] rounded-full -translate-y-1/2" />
                <div className="max-w-3xl mx-auto px-4 relative">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-black tracking-[0.3em] mb-8">
                        Technical Knowledge Base
                    </span>
                    <h1 className="font-display text-5xl sm:text-6xl font-black text-surface-50 mb-6 uppercase tracking-tighter">
                        Frequently Asked <br />
                        <span className="text-amber-500">Inquiries.</span>
                    </h1>
                    <p className="text-surface-200/60 text-lg font-medium max-w-xl mx-auto">
                        Critical operational data and procurement protocols for Apex Industrial partners.
                    </p>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
                <div className="grid gap-4">
                    {faqs.map(({ q, a }, i) => (
                        <details
                            key={i}
                            className="group bg-charcoal-800 border border-surface-200/10 rounded-[32px] overflow-hidden hover:border-amber-500/20 transition-all shadow-xl"
                        >
                            <summary className="flex items-center justify-between gap-6 p-8 cursor-pointer list-none font-display text-xl font-black text-surface-50 hover:text-amber-500 transition-colors uppercase tracking-tight">
                                {q}
                                <ChevronDown className="w-6 h-6 text-surface-200/20 group-open:rotate-180 transition-transform shrink-0 group-open:text-amber-500" />
                            </summary>
                            <div className="px-8 pb-8 text-surface-200 leading-relaxed font-medium text-lg border-t border-surface-200/5 pt-6">
                                {a}
                            </div>
                        </details>
                    ))}
                </div>

                <div className="mt-20 bg-charcoal-800 border border-surface-200/10 rounded-[40px] p-12 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-amber-500/5 blur-3xl rounded-full" />
                    <p className="font-display text-2xl font-black text-surface-50 mb-4 uppercase tracking-tight">Technical Support Required?</p>
                    <p className="text-surface-200/60 text-lg font-medium mb-10 max-w-lg mx-auto">
                        Our engineering team is available for direct consultation regarding custom specifications and complex fleet deployments.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center px-10 py-4 bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-amber-500/20"
                    >
                        Contact Engineering Hub
                    </Link>
                </div>
            </section>
        </div>
    );
}
