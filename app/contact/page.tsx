"use client";

import { useState } from "react";
import { Mail, Phone, Send, CheckCircle, MapPin, Truck } from "lucide-react";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setError("");
        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed to send");
            setStatus("success");
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch {
            setStatus("error");
            setError("Something went wrong. Please try again or email us directly.");
        }
    };

    return (
        <div className="min-h-screen bg-charcoal-900 font-sans">
            {/* Hero Section */}
            <section className="bg-charcoal-800 border-b border-surface-200/5 py-24 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-amber-500/5 blur-[120px] rounded-full" />
                <div className="max-w-3xl mx-auto px-4 relative">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-black tracking-[0.3em] mb-8">
                        Connect With Us
                    </span>
                    <h1 className="font-display text-5xl sm:text-7xl font-black text-surface-50 mb-6 uppercase tracking-tighter">
                        GET IN <span className="text-amber-500">TOUCH.</span>
                    </h1>
                    <p className="text-surface-200/60 text-xl font-medium max-w-2xl mx-auto">
                        Questions about specific parts, custom beds, or fleet orders?
                        Our engineering team is standing by.
                    </p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 grid md:grid-cols-2 gap-20 items-start">
                {/* Contact info */}
                <div className="space-y-12">
                    <div>
                        <h2 className="font-display text-3xl font-black text-surface-50 mb-8 uppercase tracking-tight">Direct Support</h2>
                        <div className="space-y-4 mb-12">
                            {[
                                { icon: Mail, label: "Email Support", value: "support@apextruckparts.com" },
                                { icon: Phone, label: "Fleet Sales", value: "1-800-APEX-TRK" },
                                { icon: MapPin, label: "HQ & Facility", value: "Industrial District, Houston, TX" },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-center gap-6 p-6 bg-charcoal-800 border border-surface-200/5 rounded-[32px] group hover:border-amber-500/30 transition-all shadow-xl">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                                        <Icon className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-surface-200/40 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
                                        <p className="text-surface-50 font-bold text-lg">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-[40px] overflow-hidden h-64 border border-surface-200/10 group shadow-2xl bg-charcoal-800">
                            <img
                                src="/assets/restoration/workshop.png"
                                alt="Apex Workshop"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Form Wrapper */}
                <div className="bg-charcoal-800 border border-surface-200/10 p-10 sm:p-12 rounded-[48px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />

                    {status === "success" ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-20">
                            <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center mb-8 border border-amber-500/30">
                                <CheckCircle className="w-12 h-12 text-amber-600" />
                            </div>
                            <h3 className="font-display text-4xl font-black text-surface-50 mb-4 uppercase tracking-tight">Transmission Received</h3>
                            <p className="text-surface-200/60 text-lg font-medium">Our team will respond within 24 hours.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-10">
                                <h2 className="font-display text-3xl font-black text-surface-50 mb-2 uppercase tracking-tight">Inquiry Portal</h2>
                                <p className="text-surface-200/60 font-medium">Please provide detailed requirements for faster processing.</p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {[
                                        { field: "name", label: "Full Name", type: "text" },
                                        { field: "email", label: "Professional Email", type: "email" },
                                    ].map(({ field, label, type }) => (
                                        <div key={field}>
                                            <label className="block text-[10px] font-black text-surface-200/60 uppercase tracking-[0.2em] mb-3 ml-1">{label}</label>
                                            <input
                                                type={type}
                                                required
                                                value={form[field as keyof typeof form]}
                                                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                                                className="w-full px-6 py-4 bg-charcoal-900 border border-surface-200/5 rounded-2xl text-surface-50 font-medium focus:outline-none focus:border-amber-500/50 focus:bg-charcoal-950 transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-surface-200/60 uppercase tracking-[0.2em] mb-3 ml-1">Subject / Part Number</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.subject}
                                        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                                        className="w-full px-6 py-4 bg-charcoal-900 border border-surface-200/5 rounded-2xl text-surface-50 font-medium focus:outline-none focus:border-amber-500/50 focus:bg-charcoal-950 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-surface-200/60 uppercase tracking-[0.3em] mb-3 ml-1">Message Details</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={form.message}
                                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                                        className="w-full px-6 py-4 bg-charcoal-900 border border-surface-200/5 rounded-2xl text-surface-50 font-medium focus:outline-none focus:border-amber-500/50 focus:bg-charcoal-950 transition-all resize-none"
                                    />
                                </div>
                                {error && <p className="text-sm text-red-500 font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="w-full flex items-center justify-center gap-4 py-5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-charcoal-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98] text-lg"
                                >
                                    {status === "loading" ? "UPLOADING DATA…" : (
                                        <>
                                            DISPATCH MESSAGE
                                            <Send className="w-5 h-5 fill-charcoal-950" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
