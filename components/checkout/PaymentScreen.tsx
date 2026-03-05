"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Lock, MapPin, ShieldCheck, CreditCard, Pencil } from "lucide-react";
import { useCheckout } from "@/context/CheckoutContext";
import { PAYMENT_METHODS } from "@/lib/constants";
import { calculateCartSummary, formatCurrency, cn } from "@/lib/utils";
import type { PaymentMethod, PlaceOrderPayload, PlaceOrderResponse } from "@/types";
import Button from "@/components/ui/Button";
import OrderSummaryPanel from "@/components/checkout/OrderSummaryPanel";

export default function PaymentScreen() {
  const { state, setPaymentMethod, setOrder, setError, goToStep } = useCheckout();
  const [selected, setSelected] = useState<PaymentMethod>(state.paymentMethod ?? "upi");
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
      if (!res.ok || !data.success || !data.order) {
        throw new Error(data.error ?? "Payment failed. Please try again.");
      }
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <button onClick={() => goToStep("shipping")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a472a] transition-colors mb-4 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Shipping
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a472a]/10 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#1a472a]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
            <p className="text-gray-500 mt-0.5 text-sm">Review your order and complete payment</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* ── Delivery Address ── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card-md p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#1a472a]/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#1a472a]" />
                </div>
                <h2 className="font-bold text-gray-900 text-sm">Delivering To</h2>
              </div>
              <button onClick={() => goToStep("shipping")}
                className="flex items-center gap-1 text-xs text-[#1a472a] hover:underline font-semibold">
                <Pencil className="w-3 h-3" /> Change
              </button>
            </div>
            <div className="bg-gray-50 rounded-2xl px-4 py-3 text-sm space-y-0.5">
              <p className="font-bold text-gray-900">{addr.full_name}</p>
              {addr.address_line1 && <p className="text-gray-700">{addr.address_line1}</p>}
              {addr.address_line2 && <p className="text-gray-700">{addr.address_line2}</p>}
              <p className="text-gray-700">{addr.city}, {addr.state} — {addr.pin_code}</p>
              <p className="text-gray-500 text-xs pt-1">📞 {addr.phone} &nbsp;·&nbsp; ✉️ {addr.email}</p>
            </div>
          </div>

          {/* ── Items Preview ── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card-md p-5">
            <h2 className="font-bold text-gray-900 text-sm mb-4">Items in Your Order</h2>
            <div className="space-y-3">
              {state.cart.cartItems.map(item => (
                <div key={item.product_id} className="flex items-center gap-3 bg-gray-50 rounded-2xl px-3 py-2.5">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                    <Image src={item.image} alt={item.product_name} fill className="object-cover" sizes="48px" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.product_name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[#1a472a] shrink-0">
                    {formatCurrency(item.product_price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Payment Methods ── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card-md p-5">
            <h2 className="font-bold text-gray-900 text-sm mb-4">Select Payment Method</h2>
            <div className="space-y-3" role="radiogroup" aria-label="Payment methods">
              {PAYMENT_METHODS.map(method => (
                <label key={method.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                    selected === method.id
                      ? "border-[#1a472a] bg-[#1a472a]/5"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <input type="radio" name="payment" value={method.id}
                    checked={selected === method.id}
                    onChange={() => setSelected(method.id)}
                    className="sr-only"
                  />
                  <div className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    selected === method.id ? "border-[#1a472a]" : "border-gray-300"
                  )}>
                    {selected === method.id && <span className="h-2.5 w-2.5 rounded-full bg-[#1a472a]" />}
                  </div>
                  <span className="text-2xl">{method.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{method.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
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

          {/* ── Pay Button ── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card-md p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600 font-medium">Amount Payable</span>
              <span className="text-3xl font-bold text-[#1a472a]">{formatCurrency(summary.grand_total)}</span>
            </div>
            <Button fullWidth size="lg" isLoading={processing} onClick={handlePay}
              leftIcon={<Lock className="w-4 h-4" />}>
              Pay Securely
            </Button>
            <p className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              256-bit SSL encrypted · PCI DSS compliant
            </p>
          </div>
        </div>

        {/* ── Summary ── */}
        <div className="lg:col-span-1">
          <OrderSummaryPanel cart={state.cart} />
        </div>
      </div>
    </div>
  );
}
