"use client";

import { Leaf, ShieldCheck } from "lucide-react";
import { useCheckout } from "@/context/CheckoutContext";
import type { CartData } from "@/types";
import CartScreen      from "@/components/checkout/CartScreen";
import ShippingScreen  from "@/components/checkout/ShippingScreen";
import PaymentScreen   from "@/components/checkout/PaymentScreen";
import SuccessScreen   from "@/components/checkout/SuccessScreen";
import StepIndicator   from "@/components/checkout/StepIndicator";

export default function CheckoutOrchestrator({ initialCart }: { initialCart: CartData }) {
  const { state } = useCheckout();

  const Screen = {
    cart:     <CartScreen initialCart={initialCart} />,
    shipping: <ShippingScreen />,
    payment:  <PaymentScreen />,
    success:  <SuccessScreen />,
  }[state.step];

  return (
    <div className="min-h-screen bg-[#f7f5f0]">

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-30 border-b border-gray-100"
        style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#1a472a] flex items-center justify-center shadow-sm">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-[#1a472a] text-base leading-none">Ecoyaan</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">Secure Checkout</p>
            </div>
          </div>

          <StepIndicator current={state.step} />

          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1a472a]" />
            <span>SSL Secured</span>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {Screen}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 bg-white py-4">
        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Ecoyaan · Sustainable Shopping ·{" "}
          <span className="text-[#1a472a] font-semibold">🌱 Carbon Neutral Delivery</span>
        </p>
      </footer>
    </div>
  );
}
