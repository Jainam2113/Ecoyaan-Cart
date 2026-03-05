import { NextRequest, NextResponse } from "next/server";
import type { PlaceOrderPayload, PlaceOrderResponse, Order } from "@/types";
import { generateOrderId, calculateCartSummary, sleep } from "@/lib/utils";

/**
 * POST /api/orders
 * Simulates placing an order. Validates payload, returns a mock Order.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PlaceOrderPayload;

    // Basic validation
    if (!body.cart || !body.shipping_address || !body.payment_method) {
      return NextResponse.json<PlaceOrderResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (!body.cart.cartItems?.length) {
      return NextResponse.json<PlaceOrderResponse>(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Simulate payment processing (1.5s)
    await sleep(1500);

    const order: Order = {
      order_id:        generateOrderId(),
      cart:            body.cart,
      shipping_address:body.shipping_address,
      payment_method:  body.payment_method,
      summary:         calculateCartSummary(body.cart),
      placed_at:       new Date().toISOString(),
    };

    return NextResponse.json<PlaceOrderResponse>({ success: true, order });
  } catch {
    return NextResponse.json<PlaceOrderResponse>(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
