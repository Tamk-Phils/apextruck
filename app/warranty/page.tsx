import type { Metadata } from "next";
import { Shield, AlertCircle, CheckCircle, Award, ShieldCheck, Gauge } from "lucide-react";

export const metadata: Metadata = {
    title: "Quality & Performance Guarantee | Apex Truck Parts",
    description: "Our comprehensive industrial warranty and quality assurance for every truck part and custom bed.",
};

const includes = [
    "Manufacturing defects and structural integrity (5-year coverage)",
    "Performance certification for heavy-duty application",
    "Pre-dispatch quality control inspection (120-point check)",
    "OEM specification compliance verification",
    "Corrosion resistance and finish durability guarantee",
];

export default function QualityGuaranteePage() {
    return (
        <div className="min-h-screen bg-charcoal-900 font-sans pt-32 pb-24">
            <section className="text-center mb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <ShieldCheck className="w-8 h-8 text-amber-500" />
                    </div>
                    <h1 className="font-display text-5xl sm:text-7xl font-black text-surface-50 mb-6 uppercase tracking-tighter">
                        QUALITY <span className="text-amber-500">GUARANTEE.</span>
                    </h1>
                    <p className="text-surface-200 font-medium leading-relaxed uppercase tracking-widest text-[10px] sm:text-sm">
                        Engineering Reliability for the Most Demanding Environments.
                    </p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24">
                <div className="relative aspect-[21/9] overflow-hidden rounded-[40px] border border-surface-200/10 shadow-2xl bg-charcoal-800">
                    <img
                        src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                        alt="Industrial Quality Inspection"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-transparent" />
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
                <div className="bg-charcoal-800 border border-surface-200/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full" />
                    <h2 className="font-display text-3xl font-black text-surface-50 mb-8 uppercase tracking-tight">Scope of Coverage</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {includes.map((item) => (
                            <div key={item} className="flex items-start gap-4 p-4 bg-charcoal-900/40 rounded-2xl border border-surface-200/5">
                                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="text-surface-200 text-sm font-medium leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-[40px] p-10">
                    <div className="flex items-start gap-6">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/20">
                            <AlertCircle className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-display text-2xl font-black text-surface-50 mb-4 uppercase tracking-tight">Operational Requirements</h3>
                            <ul className="text-surface-200 text-sm space-y-3 font-medium">
                                <li className="flex gap-2"><span>•</span> Installation must be performed by a certified technician or shop</li>
                                <li className="flex gap-2"><span>•</span> Maintenance logs must be maintained as per OEM specifications</li>
                                <li className="flex gap-2"><span>•</span> Guarantee does not cover damage from improper over-loading or off-book modifications</li>
                                <li className="flex gap-2"><span>•</span> Claims must be filed within 30 days of detecting a potential non-conformance</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-8">
                    <h2 className="font-display text-4xl font-black text-surface-50 mb-8 uppercase tracking-tight">Apex Quality Standards</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-sm text-surface-200 leading-bold">
                        <div className="p-8 bg-charcoal-800 border border-surface-200/10 rounded-3xl group hover:border-amber-500/20 transition-all">
                            <Gauge className="w-8 h-8 text-amber-600 mb-6" />
                            <h4 className="text-surface-50 font-black uppercase tracking-widest mb-4">Precision MFG</h4>
                            <p>Every industrial component undergoes ultrasonic testing to ensure perfect structural integrity and material density.</p>
                        </div>
                        <div className="p-8 bg-charcoal-800 border border-surface-200/10 rounded-3xl group hover:border-amber-500/20 transition-all">
                            <Shield className="w-8 h-8 text-amber-600 mb-6" />
                            <h4 className="text-surface-50 font-black uppercase tracking-widest mb-4">Stress Testing</h4>
                            <p>Our flatbeds and chassis components are load-tested to 250% of their rated capacity before receiving the Apex Seal.</p>
                        </div>
                        <div className="p-8 bg-charcoal-800 border border-surface-200/10 rounded-3xl group hover:border-amber-500/20 transition-all">
                            <Award className="w-8 h-8 text-amber-600 mb-6" />
                            <h4 className="text-surface-50 font-black uppercase tracking-widest mb-4">ISO Certified</h4>
                            <p>We operate 100% within ISO 9001:2015 standards, ensuring consistent quality across every batch and production run.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
