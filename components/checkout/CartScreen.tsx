"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Leaf, ShieldCheck, Truck, RotateCcw, Tag } from "lucide-react";
import type { CartData } from "@/types";
import { calculateCartSummary, formatCurrency } from "@/lib/utils";
import { useCheckout } from "@/context/CheckoutContext";
import Button from "@/components/ui/Button";

export default function CartScreen({ initialCart }: { initialCart: CartData }) {
  const { state, setCart, goToStep } = useCheckout();
  const cart = state.cart ?? initialCart;

  // Sync SSR cart into context on first mount
  useEffect(() => {
    if (!state.cart) setCart(initialCart);
  }, [initialCart, setCart, state.cart]);

  const s = calculateCartSummary(cart);

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {s.item_count} eco-friendly item{s.item_count !== 1 ? "s" : ""} ready for checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Items ── */}
        <div className="lg:col-span-2 space-y-4">
          {cart.cartItems.map((item, idx) => (
            <div
              key={item.product_id}
              className="bg-white rounded-3xl border border-gray-100 shadow-card hover:shadow-card-md transition-shadow p-4 flex gap-4 animate-slide-up"
              style={{ animationDelay: `${idx * 70}ms` }}
            >
              {/* Product image */}
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                <Image src={item.image} alt={item.product_name} fill className="object-cover" sizes="96px" unoptimized />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 leading-snug line-clamp-2">{item.product_name}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1a472a] bg-[#1a472a]/10 px-2 py-0.5 rounded-full mt-1.5">
                  <Leaf className="w-3 h-3" /> Eco Certified
                </span>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Qty:</span>
                    <span className="text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-xl">{item.quantity}</span>
                  </div>
                  <p className="font-bold text-[#1a472a] text-lg">
                    {formatCurrency(item.product_price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {[
              { icon: <Truck className="w-4 h-4" />,       label: "Fast Delivery" },
              { icon: <ShieldCheck className="w-4 h-4" />, label: "Secure Payments" },
              { icon: <Leaf className="w-4 h-4" />,        label: "100% Eco" },
              { icon: <RotateCcw className="w-4 h-4" />,   label: "7-Day Returns" },
            ].map(b => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 bg-white rounded-2xl p-3 border border-gray-100 shadow-card text-[#1a472a]">
                {b.icon}
                <span className="text-[11px] font-semibold text-gray-600 text-center">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Price Summary ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card-md p-5 sticky top-[80px]">
            <h2 className="font-bold text-gray-900 mb-5">Price Details</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Price ({s.item_count} item{s.item_count !== 1 ? "s" : ""})</span>
                <span className="font-medium">{formatCurrency(s.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span className={s.shipping_fee === 0 ? "text-[#1a472a] font-semibold" : "font-medium"}>
                  {s.shipping_fee === 0 ? "FREE" : formatCurrency(s.shipping_fee)}
                </span>
              </div>
              {s.discount_applied > 0 && (
                <div className="flex justify-between text-[#1a472a]">
                  <span>Discount</span>
                  <span className="font-semibold">−{formatCurrency(s.discount_applied)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between font-bold text-gray-900">
                <span>Total Amount</span>
                <span className="text-[#1a472a] text-xl">{formatCurrency(s.grand_total)}</span>
              </div>
            </div>

            {s.discount_applied > 0 && (
              <div className="mt-4 flex items-center gap-2 bg-green-50 text-[#1a472a] rounded-2xl px-3 py-2.5">
                <Tag className="w-3.5 h-3.5 shrink-0" />
                <p className="text-xs font-semibold">You save {formatCurrency(s.discount_applied)}!</p>
              </div>
            )}

            <Button
              fullWidth size="lg" className="mt-5"
              onClick={() => { setCart(cart); goToStep("shipping"); }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Checkout
            </Button>

            <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Safe & Secure Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
