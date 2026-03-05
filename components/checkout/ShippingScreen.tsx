"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { useCheckout } from "@/context/CheckoutContext";
import { shippingSchema, type ShippingFormData } from "@/lib/validations";
import { INDIAN_STATES } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import OrderSummaryPanel from "@/components/checkout/OrderSummaryPanel";

const STATE_OPTIONS = INDIAN_STATES.map(s => ({ value: s, label: s }));

export default function ShippingScreen() {
  const { state, setShipping, goToStep } = useCheckout();

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ShippingFormData>({
      resolver: zodResolver(shippingSchema),
      defaultValues: state.shippingAddress ? {
        full_name:    state.shippingAddress.full_name,
        email:        state.shippingAddress.email,
        phone:        state.shippingAddress.phone,
        address_line1:state.shippingAddress.address_line1,
        address_line2:state.shippingAddress.address_line2 ?? "",
        pin_code:     state.shippingAddress.pin_code,
        city:         state.shippingAddress.city,
        state:        state.shippingAddress.state,
      } : {},
    });

  if (!state.cart) { goToStep("cart"); return null; }

  function onSubmit(data: ShippingFormData) {
    setShipping({
      full_name:    data.full_name,
      email:        data.email,
      phone:        data.phone,
      address_line1:data.address_line1,
      address_line2:data.address_line2 ?? "",
      pin_code:     data.pin_code,
      city:         data.city,
      state:        data.state,
    });
    goToStep("payment");
  }

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <button
          onClick={() => goToStep("cart")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a472a] transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Cart
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a472a]/10 rounded-2xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[#1a472a]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipping Address</h1>
            <p className="text-gray-500 mt-0.5 text-sm">Where should we deliver your order?</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Form ── */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card-md p-6 space-y-5">

              {/* Personal Info */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Personal Information</p>
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
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Delivery Address</p>
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

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <Button type="button" variant="secondary" size="lg"
                  onClick={() => goToStep("cart")} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button type="submit" size="lg" isLoading={isSubmitting} fullWidth
                  rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Payment
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* ── Summary ── */}
        <div className="lg:col-span-1">
          <OrderSummaryPanel cart={state.cart} />
        </div>
      </div>
    </div>
  );
}
