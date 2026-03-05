import type { CartData } from "@/types";

// ─── SSR Mock Cart (used by /api/cart → CartPage SSR) ───────────────────────
// These 2 items match the assignment brief exactly.
// When user comes from /shop, the real selected cart overrides this.
export const MOCK_CART: CartData = {
  cartItems: [
    {
      product_id: 101,
      product_name: "Bamboo Toothbrush (Pack of 4)",
      product_price: 299,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=80",
    },
    {
      product_id: 102,
      product_name: "Reusable Cotton Produce Bags",
      product_price: 450,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&q=80",
    },
  ],
  shipping_fee: 50,
  discount_applied: 0,
};

export async function fetchMockCart(): Promise<CartData> {
  // Simulates async DB / API call
  await new Promise((r) => setTimeout(r, 60));
  return MOCK_CART;
}
