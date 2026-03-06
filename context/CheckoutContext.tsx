"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import type {
  CheckoutState,
  CheckoutStep,
  CartData,
  ShippingAddress,
  SavedAddress,
  PaymentMethod,
  Order,
} from "@/types";

const STORAGE_KEY = "ecoyaan_checkout_v1";

const initialState: CheckoutState = {
  step:            "cart",
  cart:            null,
  shippingAddress: null,
  savedAddresses:  [],
  paymentMethod:   null,
  order:           null,
  isLoading:       false,
  error:           null,
};

function loadFromStorage(): Partial<CheckoutState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<CheckoutState>;
    if (parsed.step === "success") parsed.step = "cart";
    return parsed;
  } catch {
    return {};
  }
}

function saveToStorage(state: CheckoutState) {
  if (typeof window === "undefined") return;
  try {
    const toSave: Partial<CheckoutState> = {
      step:            state.step === "success" ? "cart" : state.step,
      cart:            state.cart,
      shippingAddress: state.shippingAddress,
      savedAddresses:  state.savedAddresses,
      paymentMethod:   state.paymentMethod,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch { /* ignore */ }
}

function clearStorage() {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

type Action =
  | { type: "HYDRATE";              payload: Partial<CheckoutState> }
  | { type: "SET_STEP";             payload: CheckoutStep }
  | { type: "SET_CART";             payload: CartData }
  | { type: "SET_SHIPPING";         payload: ShippingAddress }
  | { type: "ADD_SAVED_ADDRESS";    payload: SavedAddress }
  | { type: "UPDATE_SAVED_ADDRESS"; payload: SavedAddress }
  | { type: "DELETE_SAVED_ADDRESS"; payload: string }
  | { type: "SET_PAYMENT_METHOD";   payload: PaymentMethod }
  | { type: "SET_ORDER";            payload: Order }
  | { type: "SET_LOADING";          payload: boolean }
  | { type: "SET_ERROR";            payload: string | null }
  | { type: "RESET" };

function reducer(state: CheckoutState, action: Action): CheckoutState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload };
    case "SET_STEP":
      return { ...state, step: action.payload, error: null };
    case "SET_CART":
      return { ...state, cart: action.payload };
    case "SET_SHIPPING":
      return { ...state, shippingAddress: action.payload };
    case "ADD_SAVED_ADDRESS":
      return { ...state, savedAddresses: [...state.savedAddresses, action.payload] };
    case "UPDATE_SAVED_ADDRESS":
      return {
        ...state,
        savedAddresses: state.savedAddresses.map(a =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case "DELETE_SAVED_ADDRESS":
      return {
        ...state,
        savedAddresses: state.savedAddresses.filter(a => a.id !== action.payload),
      };
    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload };
    case "SET_ORDER":
      return { ...state, order: action.payload, step: "success" };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return { ...initialState, savedAddresses: state.savedAddresses };
    default:
      return state;
  }
}

interface CheckoutContextValue {
  state: CheckoutState;
  setCart:              (cart: CartData) => void;
  goToStep:             (step: CheckoutStep) => void;
  setShipping:          (address: ShippingAddress) => void;
  addSavedAddress:      (address: SavedAddress) => void;
  updateSavedAddress:   (address: SavedAddress) => void;
  deleteSavedAddress:   (id: string) => void;
  setPaymentMethod:     (method: PaymentMethod) => void;
  setOrder:             (order: Order) => void;
  setLoading:           (loading: boolean) => void;
  setError:             (error: string | null) => void;
  reset:                () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = loadFromStorage();
    if (Object.keys(saved).length > 0) {
      dispatch({ type: "HYDRATE", payload: saved });
    }
  }, []);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const setCart            = useCallback((cart: CartData) => dispatch({ type: "SET_CART", payload: cart }), []);
  const goToStep           = useCallback((step: CheckoutStep) => dispatch({ type: "SET_STEP", payload: step }), []);
  const setShipping        = useCallback((address: ShippingAddress) => dispatch({ type: "SET_SHIPPING", payload: address }), []);
  const addSavedAddress    = useCallback((address: SavedAddress) => dispatch({ type: "ADD_SAVED_ADDRESS", payload: address }), []);
  const updateSavedAddress = useCallback((address: SavedAddress) => dispatch({ type: "UPDATE_SAVED_ADDRESS", payload: address }), []);
  const deleteSavedAddress = useCallback((id: string) => dispatch({ type: "DELETE_SAVED_ADDRESS", payload: id }), []);
  const setPaymentMethod   = useCallback((method: PaymentMethod) => dispatch({ type: "SET_PAYMENT_METHOD", payload: method }), []);
  const setOrder           = useCallback((order: Order) => dispatch({ type: "SET_ORDER", payload: order }), []);
  const setLoading         = useCallback((loading: boolean) => dispatch({ type: "SET_LOADING", payload: loading }), []);
  const setError           = useCallback((error: string | null) => dispatch({ type: "SET_ERROR", payload: error }), []);
  const reset              = useCallback(() => {
    clearStorage();
    dispatch({ type: "RESET" });
    if (typeof window !== "undefined") window.location.href = "/shop";
  }, []);

  const value = useMemo(
    () => ({
      state,
      setCart, goToStep, setShipping,
      addSavedAddress, updateSavedAddress, deleteSavedAddress,
      setPaymentMethod, setOrder, setLoading, setError, reset,
    }),
    [state, setCart, goToStep, setShipping, addSavedAddress, updateSavedAddress,
     deleteSavedAddress, setPaymentMethod, setOrder, setLoading, setError, reset]
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside <CheckoutProvider>");
  return ctx;
}
