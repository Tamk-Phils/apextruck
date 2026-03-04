import type { Metadata } from "next";
import BrowsePartsClient from "@/components/BrowsePartsClient";

export const metadata: Metadata = {
    title: "Parts Catalog | Apex Truck Parts",
    description: "Browse our heavy-duty inventory of truck parts and custom flatbeds. High-performance components built for the road.",
};

export default function BrowsePage() {
    return (
        <div className="min-h-screen bg-charcoal-900 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-black tracking-[0.3em] mb-6">
                    Full Inventory
                </span>
                <h1 className="font-display text-5xl sm:text-7xl font-black text-surface-50 mb-6 uppercase tracking-tighter">
                    PARTS <span className="text-amber-500">CATALOG.</span>
                </h1>
                <p className="text-surface-200 text-xl font-medium max-w-2xl leading-relaxed">
                    Filter our high-performance stock by category and specifications.
                    Every part is certified for heavy-duty industrial application.
                </p>
            </div>
            <BrowsePartsClient />
        </div>
    );
}
