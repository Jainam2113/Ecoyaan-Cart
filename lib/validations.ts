import { z } from "zod";

export const shippingSchema = z.object({
  full_name:    z.string().min(2, "Full name must be at least 2 characters"),
  email:        z.string().email("Please enter a valid email address"),
  phone:        z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  address_line1:z.string().min(5, "Address must be at least 5 characters"),
  address_line2:z.string().optional(),
  pin_code:     z.string().regex(/^\d{6}$/, "PIN code must be exactly 6 digits"),
  city:         z.string().min(2, "City name is required"),
  state:        z.string().min(2, "Please select a state"),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;
