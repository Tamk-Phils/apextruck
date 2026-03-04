"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-charcoal-900 flex flex-col items-center justify-center px-4 font-sans">
                <div className="w-24 h-24 bg-charcoal-800 rounded-full flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                    <ShoppingBag className="w-10 h-10 text-white/10" />
                </div>
                <h1 className="font-display text-4xl font-black text-white mb-4 uppercase tracking-tight">Your Cart is Empty</h1>
                <p className="text-surface-200/40 mb-10 text-center max-w-sm">You haven't added any parts to your cart yet.</p>
                <Link
                    href="/browse"
                    className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-500/20"
                >
                    Browse Inventory
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-charcoal-900 font-sans py-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="font-display text-5xl font-black text-white uppercase tracking-tighter">Your <span className="text-amber-500">Cart.</span></h1>
                        <p className="text-surface-200/40 font-medium mt-2">{totalItems} {totalItems === 1 ? 'Part' : 'Parts'} in your cart</p>
                    </div>
                    <Link href="/browse" className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-200/30 hover:text-amber-500 transition-colors">
                        Continue Shopping
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-charcoal-800 border border-white/5 rounded-[32px] p-4 sm:p-6 flex gap-6 items-center group hover:border-amber-500/20 transition-all shadow-xl">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-charcoal-900 overflow-hidden shrink-0 border border-white/5">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight truncate group-hover:text-amber-500 transition-colors">{item.name}</h3>
                                    <p className="text-amber-500 font-black text-lg mt-1">${item.price?.toLocaleString() || '0'}</p>

                                    <div className="flex items-center gap-6 mt-4">
                                        <div className="flex items-center bg-charcoal-900 rounded-xl border border-white/5 p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-10 text-center text-sm font-black text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500/40 hover:text-red-500 transition-colors flex items-center gap-2 group/del"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-charcoal-800 border border-white/5 rounded-[40px] p-8 sticky top-32 shadow-2xl">
                            <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight mb-8">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-surface-200/40 font-medium uppercase tracking-widest text-[10px]">Subtotal</span>
                                    <span className="text-white font-bold">${totalPrice?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-surface-200/40 font-medium uppercase tracking-widest text-[10px]">Shipping</span>
                                    <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Calculated at Checkout</span>
                                </div>
                                <div className="h-px bg-white/5 my-4" />
                                <div className="flex justify-between items-end">
                                    <span className="text-surface-200/40 font-black uppercase tracking-[0.2em] text-[10px]">Total (USD)</span>
                                    <span className="text-3xl font-black text-white tracking-tighter">${totalPrice?.toLocaleString() || '0'}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full py-6 bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                Checkout <ArrowRight className="w-5 h-5" />
                            </Link>

                            <div className="mt-8 flex items-center gap-4 p-4 bg-charcoal-900 border border-white/5 rounded-2xl">
                                <Truck className="w-5 h-5 text-amber-500" />
                                <p className="text-[10px] text-surface-200/40 font-black uppercase tracking-widest leading-relaxed">Secure shipping & global delivery guarantee</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
