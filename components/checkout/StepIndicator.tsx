"use client";
import { cn } from "@/lib/utils";
import type { CheckoutStep } from "@/types";

const STEPS: { id: CheckoutStep; label: string; num: number }[] = [
  { id: "cart",     label: "Cart",     num: 1 },
  { id: "shipping", label: "Shipping", num: 2 },
  { id: "payment",  label: "Payment",  num: 3 },
];
const ORDER: CheckoutStep[] = ["cart", "shipping", "payment", "success"];

export default function StepIndicator({ current }: { current: CheckoutStep }) {
  if (current === "success") return null;
  const ci = ORDER.indexOf(current);
  return (
    <nav aria-label="Checkout progress" className="flex items-center">
      {STEPS.map((step, i) => {
        const done   = ORDER.indexOf(step.id) < ci;
        const active = step.id === current;
        const last   = i === STEPS.length - 1;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1" aria-current={active ? "step" : undefined}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                done   ? "bg-[#1a472a] border-[#1a472a] text-white" :
                active ? "bg-white border-[#1a472a] text-[#1a472a] shadow-[0_0_0_3px_rgba(26,71,42,0.15)]" :
                         "bg-white border-gray-200 text-gray-400"
              )}>
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.num}
              </div>
              <span className={cn(
                "text-[10px] font-semibold whitespace-nowrap",
                active ? "text-[#1a472a]" : done ? "text-[#1a472a]" : "text-gray-400"
              )}>{step.label}</span>
            </div>
            {!last && (
              <div className={cn(
                "w-8 sm:w-14 h-0.5 mx-1 mb-4 rounded-full transition-all duration-500",
                done ? "bg-[#1a472a]" : "bg-gray-200"
              )} />
            )}
          </div>
        );
      })}
    </nav>
  );
}
