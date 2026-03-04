import Link from "next/link";
import { Truck, Heart, Phone, Mail, MapPin, ShieldCheck, PenTool as Tool, MessageSquare } from "lucide-react";

const footerSections = [
    {
        title: "Products",
        links: [
            { label: "Browse All Parts", href: "/browse" },
            { label: "Custom Truck Beds", href: "/browse" },
            { label: "Hardware & Tools", href: "/browse" },
            { label: "Fleet Solutions", href: "/contact" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "Quality Guarantee", href: "/warranty" },
            { label: "Technical Guides", href: "/maintenance" },
            { label: "Freight & Shipping", href: "/shipping" },
            { label: "Technical FAQ", href: "/faq" },
        ],
    },
    {
        title: "Account",
        links: [
            { label: "Sign In", href: "/login" },
            { label: "Create Account", href: "/register" },
            { label: "Fleet Dashboard", href: "/dashboard" },
            { label: "Support Chat", href: "/chat" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-charcoal-950 text-surface-200 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                                <Truck className="w-5 h-5 text-charcoal-950" />
                            </div>
                            <span className="font-display text-xl font-bold text-white tracking-tight">
                                APEX<span className="text-amber-500 text-xs ml-1 font-black uppercase tracking-widest">Parts</span>
                            </span>
                        </div>
                        <p className="text-sm text-surface-200/60 mb-8 leading-relaxed max-w-xs">
                            Premium truck parts and custom beds engineered for performance and durability.
                            Built for those who demand the best for their fleet.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-surface-200/60 hover:text-amber-500 transition-colors">
                                <Mail className="w-4 h-4 text-amber-500" />
                                <span>support@apextruckparts.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-surface-200/60">
                                <MapPin className="w-4 h-4 text-amber-500" />
                                <span>Industrial District, USA</span>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    {footerSections.map((section) => (
                        <div key={section.title} className="text-center md:text-left">
                            <h4 className="font-black text-white mb-6 text-xs uppercase tracking-[0.2em]">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-surface-200/60 hover:text-amber-500 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/5 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-medium text-surface-200/30 uppercase tracking-widest">
                        © {new Date().getFullYear()} Apex Truck Parts & Beds. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-surface-200/30 uppercase tracking-[0.2em]">
                        Engineered with <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> for the road
                    </div>
                </div>
            </div>
        </footer>
    );
}
