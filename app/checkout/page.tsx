"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/context";
import { useCart } from "@/lib/cart-context";
import { ArrowLeft, CheckCircle, Truck, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";

const inputCls = "w-full px-5 py-4 bg-charcoal-950 border border-white/5 rounded-2xl text-sm text-surface-50 focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-surface-200/20";
const labelCls = "block text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80 mb-3 ml-1";
const sectionCls = "bg-charcoal-800 border border-white/5 rounded-[32px] p-8 sm:p-10 space-y-8 shadow-2xl";
const sectionTitle = "font-display text-2xl font-black text-surface-50 mb-8 uppercase tracking-tight";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div>
            <label className={labelCls}>{label}{required && <span className="text-amber-500 ml-1">*</span>}</label>
            {children}
        </div>
    );
}

export default function CheckoutPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { cart, totalPrice, clearCart } = useCart();
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        first_name: "", last_name: "", email: "", phone: "",
        address: "", city: "", state: "", zip: "",
        payment_method: "zelle", notes: "",
    });

    const set = (field: string, value: string) =>
        setForm((f) => ({ ...f, [field]: value }));

    useEffect(() => {
        if (!authLoading && !user) router.push("/login");
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            const meta = user.user_metadata;
            if (meta?.name) {
                const parts = (meta.name as string).split(" ");
                setForm((f) => ({
                    ...f,
                    first_name: parts[0] ?? "",
                    last_name: parts.slice(1).join(" ") ?? "",
                }));
            }
            setForm((f) => ({ ...f, email: user.email ?? "" }));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || cart.length === 0) return;
        setSubmitting(true);
        setError("");

        try {
            // 1. Create order
            const { data: order, error: orderErr } = await supabase.from("orders").insert({
                user_id: user.id,
                status: "pending",
                payment_status: "unpaid",
                shipping_status: "pending",
                total_price: totalPrice,
                ...form,
            }).select().single();

            if (orderErr) throw orderErr;

            // 2. Create order items
            const items = cart.map(item => ({
                order_id: order.id,
                part_id: item.id,
                quantity: item.quantity,
                unit_price: item.price
            }));

            const { error: itemsErr } = await supabase.from("order_items").insert(items);
            if (itemsErr) throw itemsErr;

            // 3. Optional: Send Email/Notification (Simulated or via API)
            // ... (keeping previous email logic style if needed)

            clearCart();
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || (!user && !authLoading)) return (
        <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
        </div>
    );

    if (submitted) return (
        <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-4 font-sans">
            <div className="text-center max-w-md bg-charcoal-800 p-12 rounded-[48px] border border-white/5 shadow-2xl">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h1 className="font-display text-4xl font-black text-white mb-4 uppercase tracking-tight">Order Placed!</h1>
                <p className="text-surface-200/40 mb-10 leading-relaxed font-medium">
                    Your industrial logistics request has been received. Our team will verify the technical specifications and contact you for payment finalization.
                </p>
                <Link href="/dashboard" className="inline-block w-full py-4 bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-500/20">
                    View Fleet Dashboard
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-charcoal-900 font-sans py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <Link href="/cart" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-surface-200/30 hover:text-amber-500 transition-all mb-12">
                    <ArrowLeft className="w-4 h-4" /> Return to Cart
                </Link>

                <div className="grid lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className={sectionCls}>
                                <h2 className={sectionTitle}>Logistics Information</h2>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <Field label="First Name" required>
                                        <input type="text" required value={form.first_name} onChange={(e) => set("first_name", e.target.value)} className={inputCls} />
                                    </Field>
                                    <Field label="Last Name" required>
                                        <input type="text" required value={form.last_name} onChange={(e) => set("last_name", e.target.value)} className={inputCls} />
                                    </Field>
                                    <Field label="Email" required>
                                        <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
                                    </Field>
                                    <Field label="Phone" required>
                                        <input type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
                                    </Field>
                                </div>
                                <div className="grid gap-6">
                                    <Field label="Street Address" required>
                                        <input type="text" required value={form.address} onChange={(e) => set("address", e.target.value)} className={inputCls} />
                                    </Field>
                                    <div className="grid sm:grid-cols-3 gap-6">
                                        <Field label="City" required>
                                            <input type="text" required value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls} />
                                        </Field>
                                        <Field label="State" required>
                                            <input type="text" required value={form.state} onChange={(e) => set("state", e.target.value)} className={inputCls} />
                                        </Field>
                                        <Field label="ZIP" required>
                                            <input type="text" required value={form.zip} onChange={(e) => set("zip", e.target.value)} className={inputCls} />
                                        </Field>
                                    </div>
                                </div>
                            </div>

                            <div className={sectionCls}>
                                <h2 className={sectionTitle}>Payment Method</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: "zelle", label: "Zelle" },
                                        { id: "chime", label: "Chime" },
                                        { id: "apple_pay", label: "Apple Pay" },
                                        { id: "wire", label: "Wire Transfer" },
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => set("payment_method", m.id)}
                                            className={`p-4 rounded-xl border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${form.payment_method === m.id ? 'bg-amber-500 border-amber-500 text-charcoal-950' : 'bg-charcoal-900 border-white/10 text-white/40 hover:border-white/20'}`}
                                        >
                                            <CreditCard className="w-4 h-4" />
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                                <Field label="Additional Requirements">
                                    <textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Technical specifications, delivery notes, etc." className={inputCls + " resize-none"} />
                                </Field>
                            </div>

                            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold uppercase tracking-widest">{error}</div>}

                            <button
                                type="submit"
                                disabled={submitting || cart.length === 0}
                                className="w-full py-6 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-charcoal-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-500/20 text-lg flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {submitting ? (
                                    <div className="w-6 h-6 border-2 border-charcoal-950/20 border-t-charcoal-950 rounded-full animate-spin" />
                                ) : (
                                    <>Finalize Order Request <ArrowLeft className="w-5 h-5 rotate-180" /></>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-charcoal-800 border border-white/5 rounded-[40px] p-8 sticky top-32 shadow-2xl">
                            <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight mb-8">Summary</h2>
                            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-8 custom-scrollbar">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center p-3 bg-charcoal-900/50 rounded-2xl border border-white/5">
                                        <div className="w-12 h-12 rounded-lg bg-charcoal-800 overflow-hidden shrink-0">
                                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-black text-white uppercase truncate">{item.name}</p>
                                            <p className="text-[10px] text-surface-200/20 font-black uppercase tracking-widest mt-0.5">Qty: {item.quantity} · ${item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-surface-200/20 uppercase tracking-[0.2em]">Purchase Total</span>
                                    <span className="text-3xl font-black text-white tracking-tighter">${totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-4 text-emerald-500">
                                        <ShieldCheck className="w-5 h-5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Global Freight Protected</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
