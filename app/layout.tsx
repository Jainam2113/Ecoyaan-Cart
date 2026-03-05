import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CheckoutProvider } from "@/context/CheckoutContext";

export const metadata: Metadata = {
  title: { default: "Ecoyaan — Sustainable Checkout", template: "%s | Ecoyaan" },
  description: "India's sustainable shopping platform. Eco-friendly products delivered carbon-neutral.",
  keywords: ["eco-friendly", "sustainable", "green shopping", "India", "zero waste"],
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CheckoutProvider>{children}</CheckoutProvider>
      </body>
    </html>
  );
}
