/**
 * /checkout — Server Component with SSR data fetching.
 *
 * SSR is demonstrated by:
 * - `export const dynamic = "force-dynamic"` — runs fresh on every request
 * - `fetchMockCart()` is async (simulates DB/API latency)
 * - Equivalent to `getServerSideProps` in Pages Router
 *
 * We import mock data directly instead of fetching our own API route.
 * Self-referencing HTTP calls are unreliable on serverless platforms (Vercel).
 * The correct Next.js App Router pattern: import data sources directly
 * in Server Components — no internal fetch needed.
 */

import type { Metadata } from "next";
import { fetchMockCart } from "@/lib/mock-data";
import CheckoutOrchestrator from "@/components/checkout/CheckoutOrchestrator";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your eco-friendly purchase on Ecoyaan.",
};

// SSR: force fresh data on every request (no caching)
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  // Runs SERVER-SIDE on every request — this IS the SSR data fetch
  const initialCart = await fetchMockCart();
  return <CheckoutOrchestrator initialCart={initialCart} />;
}
