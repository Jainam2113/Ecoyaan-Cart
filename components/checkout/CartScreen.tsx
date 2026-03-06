"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Leaf, ShieldCheck, Truck, RotateCcw, Tag, Package } from "lucide-react";
import type { CartData } from "@/types";
import { calculateCartSummary, formatCurrency } from "@/lib/utils";
import { useCheckout } from "@/context/CheckoutContext";

export default function CartScreen({ initialCart }: { initialCart: CartData }) {
  const { state, setCart, goToStep } = useCheckout();
  const cart = state.cart ?? initialCart;

  useEffect(() => {
    if (!state.cart) setCart(initialCart);
  }, [initialCart, setCart, state.cart]);

  const s = calculateCartSummary(cart);

  return (
    <div className="animate-slide-up pb-32">
      {/* ── Page Header ── */}
      <div className="mb-7">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-[#1a472a]/10 rounded-2xl flex items-center justify-center">
            <Package className="w-5 h-5 text-[#1a472a]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-gray-400 text-xs mt-0.5">
              {s.item_count} item{s.item_count !== 1 ? "s" : ""} · Review before checkout
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Left: Items ── */}
        <div className="lg:col-span-2 space-y-3">
          {cart.cartItems.map((item, idx) => (
            <div
              key={item.product_id}
              className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-md transition-all duration-200 p-4 flex gap-4 animate-slide-up group"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src={item.image} alt={item.product_name}
                  fill className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="80px" unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 leading-snug text-sm line-clamp-2">{item.product_name}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1a472a] bg-[#1a472a]/10 px-2 py-0.5 rounded-full mt-1.5">
                  <Leaf className="w-3 h-3" /> Eco Certified
                </span>
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">Qty</span>
                    <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-lg tabular-nums">{item.quantity}</span>
                  </div>
                  <p className="font-bold text-[#1a472a]">{formatCurrency(item.product_price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {[
              { icon: <Truck className="w-4 h-4" />,       label: "Fast Delivery" },
              { icon: <ShieldCheck className="w-4 h-4" />, label: "Secure Payments" },
              { icon: <Leaf className="w-4 h-4" />,        label: "100% Eco" },
              { icon: <RotateCcw className="w-4 h-4" />,   label: "7-Day Returns" },
            ].map(b => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 bg-white rounded-xl p-3 border border-gray-100 text-[#1a472a]">
                {b.icon}
                <span className="text-[11px] font-semibold text-gray-500 text-center">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Price Summary (desktop) ── */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card-md p-5 sticky top-[80px]">
            <h2 className="font-bold text-gray-900 text-sm mb-4">Price Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({s.item_count} item{s.item_count !== 1 ? "s" : ""})</span>
                <span className="font-medium text-gray-700">{formatCurrency(s.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className={s.shipping_fee === 0 ? "text-[#1a472a] font-semibold" : "font-medium text-gray-700"}>
                  {s.shipping_fee === 0 ? "FREE" : formatCurrency(s.shipping_fee)}
                </span>
              </div>
              {s.discount_applied > 0 && (
                <div className="flex justify-between text-[#1a472a]">
                  <span>Discount</span>
                  <span className="font-semibold">−{formatCurrency(s.discount_applied)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-dashed border-gray-100 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-[#1a472a] text-lg">{formatCurrency(s.grand_total)}</span>
              </div>
            </div>
            {s.discount_applied > 0 && (
              <div className="mt-3 flex items-center gap-2 bg-green-50 text-[#1a472a] rounded-xl px-3 py-2">
                <Tag className="w-3.5 h-3.5 shrink-0" />
                <p className="text-xs font-semibold">You save {formatCurrency(s.discount_applied)}!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════ STICKY BOTTOM BAR ════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 -1px 0 rgba(0,0,0,0.06), 0 -8px 32px rgba(0,0,0,0.08)",
        }}
      >
        {/* Mobile price summary */}
        <div className="lg:hidden border-b border-gray-100 px-4 py-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{s.item_count} item{s.item_count !== 1 ? "s" : ""}</span>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-xs">Shipping: {s.shipping_fee === 0 ? "FREE" : formatCurrency(s.shipping_fee)}</span>
              <span className="font-bold text-[#1a472a] text-base">{formatCurrency(s.grand_total)}</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Left: total on desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <div>
              <p className="text-xs text-gray-400">Total Amount</p>
              <p className="text-xl font-bold text-[#1a472a]">{formatCurrency(s.grand_total)}</p>
            </div>
            {s.discount_applied > 0 && (
              <span className="text-xs font-semibold bg-green-100 text-[#1a472a] px-2 py-1 rounded-full">
                Save {formatCurrency(s.discount_applied)}
              </span>
            )}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* No back on first step — show continue shopping */}
            <button
              onClick={() => { if (typeof window !== "undefined") window.location.href = "/shop"; }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all whitespace-nowrap"
            >
              ← Shop
            </button>
            <button
              onClick={() => { setCart(cart); goToStep("shipping"); }}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#1a472a] text-white text-sm font-bold hover:bg-[#145222] active:scale-[0.98] transition-all shadow-brand"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
