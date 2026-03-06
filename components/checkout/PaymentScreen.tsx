"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft, Lock, MapPin, ShieldCheck, CreditCard,
  Pencil, Check, Smartphone, Building2, Banknote, Truck,
} from "lucide-react";
import { useCheckout } from "@/context/CheckoutContext";
import { calculateCartSummary, formatCurrency, cn } from "@/lib/utils";
import type { PaymentMethod, PlaceOrderPayload, PlaceOrderResponse } from "@/types";
import OrderSummaryPanel from "@/components/checkout/OrderSummaryPanel";

const METHODS: {
  id: PaymentMethod;
  label: string;
  desc: string;
  icon: React.ReactNode;
  badge?: string;
}[] = [
  {
    id: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm, BHIM",
    icon: <Smartphone className="w-5 h-5" />, badge: "Instant",
  },
  {
    id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    id: "netbanking", label: "Net Banking", desc: "All major Indian banks",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: "cod", label: "Cash on Delivery", desc: "Pay when order arrives",
    icon: <Banknote className="w-5 h-5" />,
  },
];

export default function PaymentScreen() {
  const { state, setPaymentMethod, setOrder, setError, goToStep } = useCheckout();
  const [selected, setSelected]   = useState<PaymentMethod>(state.paymentMethod ?? "upi");
  const [processing, setProcessing] = useState(false);

  if (!state.cart || !state.shippingAddress) { goToStep("cart"); return null; }

  const summary = calculateCartSummary(state.cart);
  const addr    = state.shippingAddress;

  async function handlePay() {
    if (!state.cart || !state.shippingAddress) return;
    setProcessing(true);
    setError(null);
    setPaymentMethod(selected);
    try {
      const payload: PlaceOrderPayload = {
        cart:            state.cart,
        shipping_address:state.shippingAddress,
        payment_method:  selected,
      };
      const res  = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: PlaceOrderResponse = await res.json();
      if (!res.ok || !data.success || !data.order) throw new Error(data.error ?? "Payment failed.");
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="animate-slide-up pb-32">
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a472a]/10 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#1a472a]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
            <p className="text-gray-400 text-xs mt-0.5">Review your order and pay securely</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">

          {/* ── Delivery Address ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card-md p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#1a472a]/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-[#1a472a]" />
                </div>
                <h2 className="font-bold text-gray-900 text-sm">Delivering To</h2>
              </div>
              <button
                onClick={() => goToStep("shipping")}
                className="flex items-center gap-1 text-xs text-[#1a472a] hover:underline font-semibold"
              >
                <Pencil className="w-3 h-3" /> Change
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1a472a] rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-900">{addr.full_name}</p>
                  {addr.address_line1 && <p className="text-gray-600 text-xs">{addr.address_line1}</p>}
                  {addr.address_line2 && <p className="text-gray-600 text-xs">{addr.address_line2}</p>}
                  <p className="text-gray-600 text-xs">{addr.city}, {addr.state} — {addr.pin_code}</p>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-gray-400 text-xs">📞 {addr.phone}</span>
                    <span className="text-gray-400 text-xs">✉️ {addr.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Items ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card-md p-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 text-[#1a472a]" />
              <h2 className="font-bold text-gray-900 text-sm">Items ({summary.item_count})</h2>
            </div>
            <div className="space-y-2.5">
              {state.cart.cartItems.map(item => (
                <div key={item.product_id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                    <Image src={item.image} alt={item.product_name} fill className="object-cover" sizes="44px" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 line-clamp-1">{item.product_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[#1a472a] shrink-0">
                    {formatCurrency(item.product_price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Payment Methods ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card-md p-5">
            <h2 className="font-bold text-gray-900 text-sm mb-4">Select Payment Method</h2>
            <div className="space-y-2.5" role="radiogroup">
              {METHODS.map(method => (
                <label
                  key={method.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group",
                    selected === method.id
                      ? "border-[#1a472a] bg-[#1a472a]/5"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                  )}
                >
                  <input type="radio" name="payment" value={method.id}
                    checked={selected === method.id} onChange={() => setSelected(method.id)}
                    className="sr-only" />

                  {/* Custom radio */}
                  <div className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    selected === method.id ? "border-[#1a472a] bg-[#1a472a]" : "border-gray-300"
                  )}>
                    {selected === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  {/* Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                    selected === method.id ? "bg-[#1a472a] text-white" : "bg-gray-100 text-gray-500"
                  )}>
                    {method.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{method.label}</p>
                      {method.badge && (
                        <span className="text-[10px] font-bold bg-green-100 text-[#1a472a] px-2 py-0.5 rounded-full">
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ── Error ── */}
          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-fade-in" role="alert">
              <span className="text-xl shrink-0">⚠️</span>
              <div>
                <p className="text-sm font-bold text-red-700">Payment Failed</p>
                <p className="text-sm text-red-600 mt-0.5">{state.error}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Summary ── */}
        <div className="lg:col-span-1 hidden lg:block">
          <OrderSummaryPanel cart={state.cart} />
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
        {/* Amount preview */}
        <div className="border-b border-gray-100 px-4 sm:px-6 py-2.5">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1a472a]" />
              <span className="text-xs text-gray-400">256-bit SSL · PCI DSS Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Payable:</span>
              <span className="font-bold text-[#1a472a] text-base">{formatCurrency(summary.grand_total)}</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => goToStep("shipping")}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={handlePay}
            disabled={processing}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a472a] text-white text-sm font-bold hover:bg-[#145222] active:scale-[0.98] transition-all shadow-brand disabled:opacity-60"
          >
            {processing ? (
              <>
                <svg className="animate-spin-slow h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay {formatCurrency(summary.grand_total)} Securely
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
