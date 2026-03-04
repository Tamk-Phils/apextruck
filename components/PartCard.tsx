import Link from "next/link";
import { Truck, Calendar, ArrowRight, ShieldCheck, Zap, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

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

export default function PartCard({ part }: { part: Part }) {
    const { addToCart } = useCart();
    const imageUrl = part.images?.[0] ?? null;
    const statusColor =
        part.status === "available" ? "border-emerald-500/20 text-emerald-600 bg-emerald-500/5" :
            part.status === "reserved" ? "border-amber-500/20 text-amber-600 bg-amber-500/5" :
                "border-red-500/20 text-red-600 bg-red-500/5";

    return (
        <Link href={`/parts/${part.id}`} className="group block">
            <div className="bg-charcoal-800 rounded-[32px] overflow-hidden border border-surface-200/10 hover:border-amber-500/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 relative">
                {/* Image */}
                <div className="relative h-64 bg-charcoal-900 overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={part.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-charcoal-900">
                            <Truck className="w-12 h-12 text-surface-200/20" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent opacity-60" />
                    <span
                        className={`absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg ${statusColor}`}
                    >
                        {part.status === 'available' ? 'In Stock' : part.status === 'reserved' ? 'On Hold' : 'Sold Out'}
                    </span>
                </div>

                {/* Info */}
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="font-display text-xl sm:text-2xl font-black text-surface-50 group-hover:text-amber-500 transition-colors uppercase tracking-tight">
                            {part.name}
                        </h3>
                        <div className="flex flex-col items-end">
                            <span className="text-xl font-black text-amber-600 tracking-tighter">
                                ${part.price?.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-surface-200/60 font-bold uppercase tracking-widest mt-0.5">MSRP</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-surface-200/80 mb-5 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            {part.model_year}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-surface-200/20" />
                        <span className="flex items-center gap-1.5 capitalize">
                            <Zap className="w-3.5 h-3.5 text-amber-600" />
                            {part.category === 'heavy-duty' ? 'Heavy Duty' : 'Performance'}
                        </span>
                    </div>

                    {part.description && (
                        <p className="text-sm text-surface-100 line-clamp-2 mb-6 font-medium leading-relaxed">
                            {part.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-surface-200/5">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart({
                                    id: part.id,
                                    name: part.name,
                                    price: part.price,
                                    image: imageUrl || "",
                                });
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-charcoal-950 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/10 active:scale-95"
                        >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            To Cart
                        </button>
                        <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-600 group-hover:gap-4 transition-all">
                            Details <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

