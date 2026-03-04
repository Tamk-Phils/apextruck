import type { Metadata } from "next";
import HomeHeroClient from "@/components/HomeHeroClient";
import FeaturedPartsClient from "@/components/FeaturedPartsClient";
import { ShieldCheck, PenTool as Tool, Truck, Award, Gauge, Zap, Cog } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Apex Truck Parts & Beds — Premium Hardware & Custom Flatbeds",
  description:
    "Reliable, rugged, and high-performance truck parts. From custom beds to heavy-duty hardware, Apex provides the best for your fleet and industrial needs.",
  openGraph: {
    title: "Apex Truck Parts & Beds — Premium Hardware & Custom Flatbeds",
    description: "Reliable, rugged, and high-performance truck parts. From custom beds to heavy-duty hardware.",
    images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&h=630&q=80"],
  },
};

const features = [
  { icon: ShieldCheck, title: "Industrial Warranty", desc: "Every component is backed by an industry-leading multi-year performance warranty." },
  { icon: Tool, title: "Precision Engineered", desc: "Our parts are manufactured to exact OEM specifications using high-grade aerospace steel." },
  { icon: Truck, title: "Heavy Duty Hardware", desc: "Built for the toughest environments, from construction sites to cross-country hauls." },
  { icon: Award, title: "Certified Quality", desc: "ISO 9001 certified manufacturing process ensuring consistent reliability." },
];

const GALLERY = [
  { id: "g1", url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=400&q=80", alt: "Industrial Precision" },
  { id: "g2", url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80", alt: "Logistics Hub" },
  { id: "g3", url: "https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&w=400&q=80", alt: "Heavy Duty Suspension" },
  { id: "g4", url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80", alt: "Precision Fabrication" },
  { id: "g5", url: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=400&q=80", alt: "Mechanical Engineering" },
];

export default function HomePage() {
  return (
    <div className="bg-charcoal-900">
      <HomeHeroClient />

      {/* Features strip */}
      <section className="py-20 bg-charcoal-800 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Icon className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-display text-base font-black text-surface-50 uppercase tracking-wider mb-2">{title}</h3>
                  <p className="text-sm text-surface-200 leading-relaxed font-medium">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedPartsClient />

      {/* Photo gallery strip */}
      <section className="py-24 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight uppercase">
              The <span className="text-amber-500">Apex</span> Edge
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-6" />
            <p className="text-surface-200/40 text-lg max-w-2xl mx-auto font-medium">
              Take a closer look at our precision manufacturing and high-performance fleet components.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {GALLERY.map(({ id, url, alt }) => (
              <div key={id} className="group relative rounded-3xl overflow-hidden h-56 bg-charcoal-800 border border-white/5 cursor-crosshair">
                <img src={url} alt={alt} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-in-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-24 bg-charcoal-800 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500 rounded-3xl rotate-3 scale-[1.02] opacity-20" />
            <div className="relative rounded-3xl overflow-hidden h-[450px] border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=800&q=80"
                alt="Truck assembly"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="relative">
            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-black tracking-[0.3em] mb-8">
              Legacy of Strength
            </div>
            <h2 className="font-display text-5xl sm:text-6xl font-black text-surface-50 mb-8 leading-tight tracking-tighter uppercase">
              PERFORMANCE <br /> YOU CAN TRUST
            </h2>
            <p className="text-surface-100 text-lg leading-relaxed mb-10 font-medium">
              Every Apex component is born from a commitment to uncompromising quality.
              We don&apos;t just build parts; we engineer the foundation of your reliability.
              From the first weld to the final inspection, we ensure your truck is ready for anything.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-500/10 active:scale-95 text-sm"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-32 overflow-hidden bg-charcoal-950">
        <div className="absolute inset-0 opacity-60">
          <img
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80"
            alt="Truck path"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h2 className="font-display text-5xl sm:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">
            READY TO UPGRADE <br />
            <span className="text-amber-500">YOUR FLEET?</span>
          </h2>
          <p className="text-surface-200/50 mb-12 text-xl max-w-2xl mx-auto font-medium">
            Browse our heavy-duty inventory and discover why Apex is the choice for industrial professionals.
          </p>
          <Link
            href="/browse"
            className="group inline-flex items-center gap-4 px-12 py-6 bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-amber-500/20 text-xl active:scale-95"
          >
            Start Your Build
            <Zap className="w-6 h-6 fill-charcoal-950 group-hover:scale-125 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
