"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Package, Leaf, MapPin, ShieldCheck } from "lucide-react";
import { useCheckout } from "@/context/CheckoutContext";
import { formatCurrency } from "@/lib/utils";
import { PAYMENT_METHODS } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function SuccessScreen() {
  const { state, reset } = useCheckout();
  const order = state.order;

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  if (!order) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-400">Order not found.</p>
        <Button onClick={reset} className="mt-4">Start Over</Button>
      </div>
    );
  }

  const paymentLabel = PAYMENT_METHODS.find(m => m.id === order.payment_method)?.label ?? order.payment_method;
  const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div className="flex flex-col items-center py-4 animate-scale-in">

      {/* ── Success animation ── */}
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-full bg-[#1a472a]/10 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#1a472a] flex items-center justify-center shadow-brand-lg animate-bounce-soft">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <span className="absolute -top-1 -right-1 text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>🌿</span>
        <span className="absolute -bottom-1 -left-2 text-xl animate-bounce" style={{ animationDelay: "0.5s" }}>🌱</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">Order Successful! 🎉</h1>
      <p className="text-gray-500 text-center max-w-sm mt-2 text-sm">
        Thank you for choosing sustainability. Your eco-friendly order is confirmed!
      </p>

      {/* Order ID */}
      <div className="mt-5 inline-flex flex-col items-center gap-1 bg-[#1a472a]/10 border border-[#1a472a]/20 rounded-2xl px-6 py-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
        <p className="font-mono font-bold text-[#1a472a] text-lg tracking-wide">{order.order_id}</p>
      </div>

      {/* ── Main card ── */}
      <div className="w-full max-w-xl mt-7 bg-white rounded-3xl border border-gray-100 shadow-card-lg overflow-hidden">

        {/* Items */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5 bg-gray-50/60">
          <Package className="w-4 h-4 text-[#1a472a]" />
          <h2 className="font-bold text-gray-900 text-sm">Items Ordered</h2>
        </div>
        <ul className="divide-y divide-gray-50">
          {order.cart.cartItems.map(item => (
            <li key={item.product_id} className="flex items-center gap-3 px-6 py-3.5">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <Image src={item.image} alt={item.product_name} fill className="object-cover" sizes="48px" unoptimized />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.product_name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-gray-900 shrink-0">
                {formatCurrency(item.product_price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        {/* Totals */}
        <div className="px-6 py-4 bg-gray-50/40 border-t border-gray-100 space-y-2.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium">{formatCurrency(order.summary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className={order.summary.shipping_fee === 0 ? "text-[#1a472a] font-semibold" : "font-medium"}>
              {order.summary.shipping_fee === 0 ? "FREE 🎉" : formatCurrency(order.summary.shipping_fee)}
            </span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-2.5 border-t border-gray-200">
            <span>Total Paid</span>
            <span className="text-[#1a472a] text-lg">{formatCurrency(order.summary.grand_total)}</span>
          </div>
        </div>

        {/* Delivery + payment */}
        <div className="px-6 py-4 border-t border-gray-100 space-y-3 text-sm">
          <div className="flex items-start gap-3 bg-gray-50 rounded-2xl px-4 py-3">
            <MapPin className="w-4 h-4 text-[#1a472a] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">{order.shipping_address.full_name}</p>
              {order.shipping_address.address_line1 && (
                <p className="text-gray-600 text-xs mt-0.5">{order.shipping_address.address_line1}</p>
              )}
              <p className="text-gray-600 text-xs">
                {order.shipping_address.city}, {order.shipping_address.state} — {order.shipping_address.pin_code}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-semibold text-gray-800">{paymentLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Expected Delivery</span>
            <span className="font-semibold text-[#1a472a]">{deliveryDate}</span>
          </div>
        </div>

        {/* Eco footer */}
        <div className="px-6 py-3.5 bg-[#1a472a]/5 border-t border-[#1a472a]/10 flex items-center justify-center gap-2">
          <Leaf className="w-3.5 h-3.5 text-[#1a472a]" />
          <p className="text-xs text-[#1a472a] font-semibold">A tree will be planted in your name 🌳</p>
        </div>
      </div>

      <p className="flex items-center gap-1.5 mt-5 text-xs text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5" />
        Confirmation sent to {order.shipping_address.email}
      </p>

      <div className="mt-7">
        <Button variant="secondary" size="lg" onClick={reset}>Continue Shopping</Button>
      </div>
    </div>
  );
}
