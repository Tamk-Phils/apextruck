"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ArrowLeft, Upload, X, Truck, Zap, Scale, ShieldCheck, Cog, XCircle } from "lucide-react";
import Link from "next/link";

interface Form {
    name: string; model_year: string; category: string; price: string; status: string; description: string;
}

export default function EditPartPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [form, setForm] = useState<Form>({ name: "", model_year: "", category: "performance", price: "", status: "available", description: "" });
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        supabase.from("parts").select("*").eq("id", id).single().then(({ data }) => {
            if (data) {
                setForm({ name: data.name, model_year: data.model_year, category: data.category, price: String(data.price), status: data.status, description: data.description ?? "" });
                setImages(data.images ?? []);
            }
        });
    }, [id]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setUploading(true);
        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            if (res.ok) { const { url } = await res.json(); setImages((prev) => [...prev, url]); }
        }
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const { error: err } = await supabase.from("parts").update({ ...form, price: parseFloat(form.price), images }).eq("id", id);
        if (err) { setError(err.message); setSaving(false); }
        else router.push("/admin/parts");
    };

    return (
        <div className="p-6 sm:p-10 bg-charcoal-900 min-h-screen font-sans">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/admin/parts"
                    className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-surface-200/40 hover:text-amber-500 transition-all mb-12"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Inventory
                </Link>

                <header className="mb-12">
                    <h1 className="font-display text-4xl sm:text-6xl font-black text-surface-50 uppercase tracking-tighter">
                        EDIT <span className="text-amber-500">PART.</span>
                    </h1>
                    <p className="text-surface-200/40 text-[10px] font-black uppercase tracking-[0.2em] mt-3">
                        Edit details for: <span className="text-surface-50">{form.name || id}</span>
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-charcoal-800 border border-surface-200/5 rounded-[40px] p-10 shadow-2xl space-y-8">
                        <div className="grid sm:grid-cols-2 gap-8">
                            {[
                                { field: "name", label: "Part Name", type: "text" },
                                { field: "model_year", label: "Year", type: "text" },
                                { field: "price", label: "Price ($)", type: "number" },
                            ].map(({ field, label, type }) => (
                                <div key={field}>
                                    <label className="block text-[10px] font-black text-surface-200/40 uppercase tracking-[0.2em] mb-3">{label}</label>
                                    <input
                                        type={type}
                                        required
                                        value={form[field as keyof Form]}
                                        onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                                        className="w-full px-6 py-4 bg-charcoal-900 border border-surface-200/5 rounded-2xl text-sm text-surface-50 focus:outline-none focus:border-amber-500/50 transition-all"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-[10px] font-black text-surface-200/40 uppercase tracking-[0.2em] mb-3">Performance Class</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                                    className="w-full px-6 py-4 bg-charcoal-900 border border-surface-200/5 rounded-2xl text-sm text-surface-50 focus:outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="heavy-duty">Heavy Duty</option>
                                    <option value="performance">Performance</option>
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-black text-surface-200/40 uppercase tracking-[0.2em] mb-3">Inventory Status</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: "available", label: "Ready", color: "text-emerald-600" },
                                        { id: "reserved", label: "On Hold", color: "text-amber-600" },
                                        { id: "sold", label: "Sold Out", color: "text-red-600" },
                                    ].map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => setForm((f) => ({ ...f, status: s.id }))}
                                            className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${form.status === s.id
                                                ? `bg-charcoal-950 border-white/20 ${s.color} text-white`
                                                : "bg-transparent border-surface-200/5 text-surface-200/40 hover:border-surface-200/20"
                                                }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-surface-200/40 uppercase tracking-[0.2em] mb-3">Technical Description</label>
                            <textarea
                                rows={5}
                                value={form.description}
                                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                className="w-full px-6 py-4 bg-charcoal-900 border border-surface-200/5 rounded-2xl text-sm text-surface-50 focus:outline-none focus:border-amber-500/50 transition-all resize-none font-medium leading-relaxed"
                            />
                        </div>
                    </div>

                    <div className="bg-charcoal-800 border border-surface-200/5 rounded-[40px] p-10 shadow-2xl">
                        <h2 className="text-[10px] font-black text-surface-200/40 uppercase tracking-[0.3em] mb-8 text-center">Unit Media Assets</h2>
                        {images.length > 0 && (
                            <div className="flex flex-wrap gap-4 mb-8 justify-center">
                                {images.map((url, i) => (
                                    <div key={i} className="relative w-28 h-28 rounded-2xl overflow-hidden border border-surface-200/5 group">
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setImages((imgs) => imgs.filter((_, j) => j !== i))}
                                            className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                        >
                                            <X className="w-6 h-6 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-surface-200/10 rounded-[32px] hover:border-amber-500/30 hover:bg-white transition-all group">
                            <Upload className="w-6 h-6 text-surface-200/20 group-hover:text-amber-500 mb-2 transition-colors" />
                            <span className="text-[10px] font-black text-surface-200/40 uppercase tracking-widest group-hover:text-surface-50">
                                {uploading ? "TRANSFERRING..." : "ADD MEDIA ASSETS"}
                            </span>
                            <input type="file" className="sr-only" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                    </div>

                    {error && (
                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-4 text-red-500 text-xs font-black uppercase tracking-widest">
                            <XCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-6 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-charcoal-950 font-black uppercase tracking-[0.2em] rounded-[32px] transition-all shadow-2xl shadow-amber-500/20 text-lg active:scale-[0.99]"
                    >
                        {saving ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                </form>
            </div>
        </div>
    );
}
