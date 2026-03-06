// ─── Cart & Products ──────────────────────────────────────────────────────────

export interface CartItem {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  image: string;
}

export interface CartData {
  cartItems: CartItem[];
  shipping_fee: number;
  discount_applied: number;
}

export interface CartSummary {
  item_count: number;
  subtotal: number;
  shipping_fee: number;
  discount_applied: number;
  grand_total: number;
}

// ─── Shipping ─────────────────────────────────────────────────────────────────

export interface ShippingAddress {
  full_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  pin_code: string;
  city: string;
  state: string;
}

// A saved address has a unique id + optional label (Home, Work, etc.)
export interface SavedAddress extends ShippingAddress {
  id: string;
  label: string; // "Home" | "Work" | "Other"
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

// ─── Order ───────────────────────────────────────────────────────────────────

export interface Order {
  order_id: string;
  cart: CartData;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  summary: CartSummary;
  placed_at: string;
}

// ─── API payloads ─────────────────────────────────────────────────────────────

export interface PlaceOrderPayload {
  cart: CartData;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
}

export interface PlaceOrderResponse {
  success: boolean;
  order?: Order;
  error?: string;
}

// ─── Checkout flow ────────────────────────────────────────────────────────────

export type CheckoutStep = "cart" | "shipping" | "payment" | "success";

export interface CheckoutState {
  step: CheckoutStep;
  cart: CartData | null;
  shippingAddress: ShippingAddress | null;
  savedAddresses: SavedAddress[];
  paymentMethod: PaymentMethod | null;
  order: Order | null;
  isLoading: boolean;
  error: string | null;
}
