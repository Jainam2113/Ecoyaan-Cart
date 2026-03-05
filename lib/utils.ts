import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CartData, CartSummary } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateCartSummary(cart: CartData): CartSummary {
  const subtotal = cart.cartItems.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );
  const grand_total = subtotal + cart.shipping_fee - cart.discount_applied;
  return {
    item_count: cart.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    shipping_fee: cart.shipping_fee,
    discount_applied: cart.discount_applied,
    grand_total,
  };
}

export function generateOrderId(): string {
  const ts  = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ECO-${ts}-${rnd}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
