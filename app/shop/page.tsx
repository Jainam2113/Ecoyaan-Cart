import type { Metadata } from "next";
import ShopPage from "@/components/checkout/ShopPage";

export const metadata: Metadata = {
  title: "Shop Eco Products",
  description: "Browse 12 handpicked sustainable eco-friendly products.",
};

/**
 * /shop — Server Component shell.
 * ShopPage is a Client Component for interactivity.
 */
export default function Shop() {
  return <ShopPage />;
}
