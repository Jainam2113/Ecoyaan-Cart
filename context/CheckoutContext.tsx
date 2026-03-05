"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import type {
  CheckoutState,
  CheckoutStep,
  CartData,
  ShippingAddress,
  PaymentMethod,
  Order,
} from "@/types";

// ─── State & Actions ──────────────────────────────────────────────────────────

const initialState: CheckoutState = {
  step: "cart",
  cart: null,
  shippingAddress: null,
  paymentMethod: null,
  order: null,
  isLoading: false,
  error: null,
};

type Action =
  | { type: "SET_STEP"; payload: CheckoutStep }
  | { type: "SET_CART"; payload: CartData }
  | { type: "SET_SHIPPING"; payload: ShippingAddress }
  | { type: "SET_PAYMENT_METHOD"; payload: PaymentMethod }
  | { type: "SET_ORDER"; payload: Order }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };

function reducer(state: CheckoutState, action: Action): CheckoutState {
  switch (action.type) {
    case "SET_STEP":           return { ...state, step: action.payload, error: null };
    case "SET_CART":           return { ...state, cart: action.payload };
    case "SET_SHIPPING":       return { ...state, shippingAddress: action.payload };
    case "SET_PAYMENT_METHOD": return { ...state, paymentMethod: action.payload };
    case "SET_ORDER":          return { ...state, order: action.payload, step: "success" };
    case "SET_LOADING":        return { ...state, isLoading: action.payload };
    case "SET_ERROR":          return { ...state, error: action.payload };
    case "RESET":              return { ...initialState };
    default:                   return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CheckoutContextValue {
  state: CheckoutState;
  setCart:           (cart: CartData) => void;
  goToStep:          (step: CheckoutStep) => void;
  setShipping:       (address: ShippingAddress) => void;
  setPaymentMethod:  (method: PaymentMethod) => void;
  setOrder:          (order: Order) => void;
  setLoading:        (loading: boolean) => void;
  setError:          (error: string | null) => void;
  reset:             () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setCart          = useCallback((cart: CartData) => dispatch({ type: "SET_CART", payload: cart }), []);
  const goToStep         = useCallback((step: CheckoutStep) => dispatch({ type: "SET_STEP", payload: step }), []);
  const setShipping      = useCallback((address: ShippingAddress) => dispatch({ type: "SET_SHIPPING", payload: address }), []);
  const setPaymentMethod = useCallback((method: PaymentMethod) => dispatch({ type: "SET_PAYMENT_METHOD", payload: method }), []);
  const setOrder         = useCallback((order: Order) => dispatch({ type: "SET_ORDER", payload: order }), []);
  const setLoading       = useCallback((loading: boolean) => dispatch({ type: "SET_LOADING", payload: loading }), []);
  const setError         = useCallback((error: string | null) => dispatch({ type: "SET_ERROR", payload: error }), []);
  const reset            = useCallback(() => {
    dispatch({ type: "RESET" });
    if (typeof window !== "undefined") window.location.href = "/shop";
  }, []);

  const value = useMemo(
    () => ({ state, setCart, goToStep, setShipping, setPaymentMethod, setOrder, setLoading, setError, reset }),
    [state, setCart, goToStep, setShipping, setPaymentMethod, setOrder, setLoading, setError, reset]
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside <CheckoutProvider>");
  return ctx;
}
