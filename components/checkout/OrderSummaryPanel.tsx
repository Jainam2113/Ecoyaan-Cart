"use client";
import Image from "next/image";
import { Leaf } from "lucide-react";
import type { CartData } from "@/types";
import { calculateCartSummary, formatCurrency } from "@/lib/utils";

export default function OrderSummaryPanel({ cart }: { cart: CartData }) {
  const s = calculateCartSummary(cart);
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-card-md overflow-hidden sticky top-[80px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
        <h3 className="font-bold text-gray-900 text-sm">Order Summary</h3>
        <span className="text-xs font-semibold bg-[#1a472a]/10 text-[#1a472a] px-2.5 py-1 rounded-full">
          {s.item_count} item{s.item_count !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Items */}
      <ul className="divide-y divide-gray-50 max-h-56 overflow-y-auto">
        {cart.cartItems.map(item => (
          <li key={item.product_id} className="flex items-center gap-3 px-5 py-3.5">
            <div className="relative h-14 w-14 shrink-0 rounded-2xl overflow-hidden bg-gray-100">
              <Image src={item.image} alt={item.product_name} fill className="object-cover" sizes="56px" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{item.product_name}</p>
              <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × {formatCurrency(item.product_price)}</p>
            </div>
            <p className="text-sm font-bold text-gray-900 shrink-0">{formatCurrency(item.product_price * item.quantity)}</p>
          </li>
        ))}
      </ul>

      {/* Totals */}
      <div className="px-5 py-4 space-y-2.5 bg-gray-50/40 border-t border-gray-100">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">{formatCurrency(s.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span className={s.shipping_fee === 0 ? "text-[#1a472a] font-semibold" : "font-medium"}>
            {s.shipping_fee === 0 ? "FREE 🎉" : formatCurrency(s.shipping_fee)}
          </span>
        </div>
        {s.discount_applied > 0 && (
          <div className="flex justify-between text-sm text-[#1a472a]">
            <span>Discount</span>
            <span className="font-semibold">−{formatCurrency(s.discount_applied)}</span>
          </div>
        )}
        <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span className="text-[#1a472a] text-xl">{formatCurrency(s.grand_total)}</span>
        </div>
      </div>

      {/* Eco note */}
      <div className="px-5 py-3 bg-[#1a472a]/5 border-t border-[#1a472a]/10 flex items-center justify-center gap-1.5">
        <Leaf className="w-3.5 h-3.5 text-[#1a472a]" />
        <p className="text-xs text-[#1a472a] font-semibold">Your order offsets carbon emissions</p>
      </div>
    </div>
  );
}
