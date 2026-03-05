import { NextResponse } from "next/server";
import { fetchMockCart } from "@/lib/mock-data";

/**
 * GET /api/cart
 * Returns mock cart data asynchronously.
 * (Still available for external use / testing)
 */
export async function GET() {
  const cart = await fetchMockCart();
  return NextResponse.json(cart);
}
