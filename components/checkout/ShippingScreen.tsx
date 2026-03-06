"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft, ArrowRight, MapPin, Plus, Pencil,
  Trash2, Home, Briefcase, MapPinned, Check,
} from "lucide-react";
import { useCheckout } from "@/context/CheckoutContext";
import { shippingSchema, type ShippingFormData } from "@/lib/validations";
import { INDIAN_STATES } from "@/lib/constants";
import type { SavedAddress } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import OrderSummaryPanel from "@/components/checkout/OrderSummaryPanel";
import { cn } from "@/lib/utils";

const STATE_OPTIONS = INDIAN_STATES.map(s => ({ value: s, label: s }));

const LABEL_ICONS: Record<string, React.ReactNode> = {
  Home:  <Home className="w-3.5 h-3.5" />,
  Work:  <Briefcase className="w-3.5 h-3.5" />,
  Other: <MapPinned className="w-3.5 h-3.5" />,
};

const ADDRESS_LABELS = ["Home", "Work", "Other"];

// ─── Address Form ─────────────────────────────────────────────────────────────
function AddressForm({
  defaultValues,
  onSave,
  onCancel,
  submitLabel = "Save Address",
}: {
  defaultValues?: Partial<ShippingFormData & { label?: string }>;
  onSave: (data: ShippingFormData, label: string) => void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [selectedLabel, setSelectedLabel] = useState(defaultValues?.label ?? "Home");

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ShippingFormData>({
      resolver: zodResolver(shippingSchema),
      defaultValues: defaultValues ?? {},
    });

  return (
    <div className="space-y-5">
      {/* Label selector */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Address Label</p>
        <div className="flex gap-2">
          {ADDRESS_LABELS.map(label => (
            <button
              key={label} type="button"
              onClick={() => setSelectedLabel(label)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all",
                selectedLabel === label
                  ? "border-[#1a472a] bg-[#1a472a]/5 text-[#1a472a]"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              )}
            >
              {LABEL_ICONS[label]} {label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-dashed border-gray-100" />

      {/* Personal Info */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Personal Information</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" required placeholder="Rahul Sharma"
            error={errors.full_name?.message} {...register("full_name")} />
          <Input label="Email Address" type="email" required placeholder="rahul@example.com"
            error={errors.email?.message} {...register("email")} />
        </div>
        <div className="mt-4">
          <Input label="Phone Number" type="tel" required placeholder="9876543210"
            hint="10-digit Indian mobile number" maxLength={10}
            error={errors.phone?.message} {...register("phone")} />
        </div>
      </div>

      <div className="border-t border-dashed border-gray-100" />

      {/* Address */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Delivery Address</p>
        <div className="space-y-4">
          <Input label="Address Line 1" required placeholder="House/Flat no., Building, Street"
            error={errors.address_line1?.message} {...register("address_line1")} />
          <Input label="Address Line 2" placeholder="Area, Colony, Landmark (optional)"
            error={errors.address_line2?.message} {...register("address_line2")} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="PIN Code" required placeholder="400001" maxLength={6}
              error={errors.pin_code?.message} {...register("pin_code")} />
            <Input label="City" required placeholder="Mumbai"
              error={errors.city?.message} {...register("city")} />
            <Select label="State" required placeholder="Select state"
              options={STATE_OPTIONS} error={errors.state?.message} {...register("state")} />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            Cancel
          </button>
        )}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit(data => onSave(data, selectedLabel))}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1a472a] text-white text-sm font-bold hover:bg-[#145222] active:scale-[0.98] transition-all disabled:opacity-60"
        >
          <Check className="w-4 h-4" /> {submitLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Address Card ─────────────────────────────────────────────────────────────
function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  address: SavedAddress;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative bg-white rounded-2xl border-2 p-4 cursor-pointer transition-all duration-200 group",
        isSelected
          ? "border-[#1a472a] shadow-[0_0_0_3px_rgba(26,71,42,0.10)]"
          : "border-gray-100 hover:border-gray-300 shadow-card"
      )}
    >
      {/* Selected check */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-[#1a472a] rounded-full flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      {/* Label badge */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className={cn(
          "inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full",
          isSelected ? "bg-[#1a472a] text-white" : "bg-gray-100 text-gray-600"
        )}>
          {LABEL_ICONS[address.label]} {address.label}
        </span>
      </div>

      <p className="font-bold text-gray-900 text-sm">{address.full_name}</p>
      <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">
        {address.address_line1}
        {address.address_line2 && `, ${address.address_line2}`}
      </p>
      <p className="text-gray-600 text-xs">{address.city}, {address.state} — {address.pin_code}</p>
      <p className="text-gray-400 text-xs mt-1">📞 {address.phone}</p>

      {/* Actions */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={e => { e.stopPropagation(); onEdit(); }}
          className="flex items-center gap-1 text-xs text-[#1a472a] font-semibold hover:underline"
        >
          <Pencil className="w-3 h-3" /> Edit
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="flex items-center gap-1 text-xs text-red-400 font-semibold hover:text-red-600 ml-auto"
        >
          <Trash2 className="w-3 h-3" /> Remove
        </button>
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ShippingScreen() {
  const { state, setShipping, addSavedAddress, updateSavedAddress, deleteSavedAddress, goToStep } = useCheckout();

  const [mode, setMode] = useState<"list" | "add" | "edit">(
    state.savedAddresses.length === 0 ? "add" : "list"
  );
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [selectedId, setSelectedId]   = useState<string | null>(
    state.shippingAddress && "id" in state.shippingAddress
      ? (state.shippingAddress as SavedAddress).id
      : state.savedAddresses[0]?.id ?? null
  );

  if (!state.cart) { goToStep("cart"); return null; }

  const editingAddress = editingId ? state.savedAddresses.find(a => a.id === editingId) : null;
  const selectedAddress = state.savedAddresses.find(a => a.id === selectedId);

  function handleAddNew(data: ShippingFormData, label: string) {
    const id = `addr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newAddr: SavedAddress = { ...data, id, label };
    addSavedAddress(newAddr);
    setSelectedId(id);
    setMode("list");
  }

  function handleUpdate(data: ShippingFormData, label: string) {
    if (!editingId) return;
    updateSavedAddress({ ...data, id: editingId, label });
    setMode("list");
    setEditingId(null);
  }

  function handleDelete(id: string) {
    deleteSavedAddress(id);
    if (selectedId === id) {
      const remaining = state.savedAddresses.filter(a => a.id !== id);
      setSelectedId(remaining[0]?.id ?? null);
    }
    if (state.savedAddresses.length === 1) setMode("add");
  }

  function handleContinue() {
    if (!selectedAddress) return;
    setShipping(selectedAddress);
    goToStep("payment");
  }

  const canContinue = !!selectedAddress && mode === "list";

  return (
    <div className="animate-slide-up pb-32">
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a472a]/10 rounded-2xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[#1a472a]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Delivery Address</h1>
            <p className="text-gray-400 text-xs mt-0.5">Choose or add a delivery address</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Left: Address Management ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card-md overflow-hidden">

            {/* Tabs */}
            {state.savedAddresses.length > 0 && (
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => { setMode("list"); setEditingId(null); }}
                  className={cn(
                    "flex-1 py-3.5 text-sm font-semibold transition-all",
                    mode === "list" || mode === "edit"
                      ? "text-[#1a472a] border-b-2 border-[#1a472a] bg-[#1a472a]/3"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  Saved Addresses ({state.savedAddresses.length})
                </button>
                <button
                  onClick={() => setMode("add")}
                  className={cn(
                    "flex-1 py-3.5 text-sm font-semibold transition-all flex items-center justify-center gap-1.5",
                    mode === "add"
                      ? "text-[#1a472a] border-b-2 border-[#1a472a] bg-[#1a472a]/3"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>
            )}

            <div className="p-5">
              {/* List mode */}
              {mode === "list" && (
                <div className="space-y-3">
                  {state.savedAddresses.map(addr => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      isSelected={selectedId === addr.id}
                      onSelect={() => setSelectedId(addr.id)}
                      onEdit={() => { setEditingId(addr.id); setMode("edit"); }}
                      onDelete={() => handleDelete(addr.id)}
                    />
                  ))}
                  <button
                    onClick={() => setMode("add")}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-400 hover:border-[#1a472a]/40 hover:text-[#1a472a] transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Another Address
                  </button>
                </div>
              )}

              {/* Add mode */}
              {mode === "add" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-bold text-gray-900 text-sm">New Delivery Address</p>
                    {state.savedAddresses.length > 0 && (
                      <button onClick={() => setMode("list")}
                        className="text-xs text-gray-400 hover:text-gray-600 font-medium">
                        ← Back to saved
                      </button>
                    )}
                  </div>
                  <AddressForm onSave={handleAddNew} onCancel={state.savedAddresses.length > 0 ? () => setMode("list") : undefined} />
                </div>
              )}

              {/* Edit mode */}
              {mode === "edit" && editingAddress && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-bold text-gray-900 text-sm">Edit Address</p>
                  </div>
                  <AddressForm
                    defaultValues={{ ...editingAddress, label: editingAddress.label }}
                    onSave={handleUpdate}
                    onCancel={() => { setMode("list"); setEditingId(null); }}
                    submitLabel="Update Address"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Summary ── */}
        <div className="lg:col-span-1 hidden lg:block">
          <OrderSummaryPanel cart={state.cart} />
        </div>
      </div>

      {/* ════ STICKY BOTTOM BAR ════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 -1px 0 rgba(0,0,0,0.06), 0 -8px 32px rgba(0,0,0,0.08)",
        }}
      >
        {/* Selected address preview */}
        {selectedAddress && mode === "list" && (
          <div className="border-b border-gray-100 px-4 sm:px-6 py-2.5 bg-[#1a472a]/3">
            <div className="max-w-5xl mx-auto flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#1a472a] rounded-full flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-[#1a472a]">{selectedAddress.label}</span>
                <span className="text-gray-300">·</span>
                <p className="text-xs text-gray-600 truncate">
                  {selectedAddress.full_name} · {selectedAddress.city}, {selectedAddress.state}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => goToStep("cart")}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a472a] text-white text-sm font-bold hover:bg-[#145222] active:scale-[0.98] transition-all shadow-brand disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue to Payment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
