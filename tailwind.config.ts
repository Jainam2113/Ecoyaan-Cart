import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1a472a",
          light: "#2d6a4f",
          dark:  "#122f1c",
          50:    "#f0fdf4",
          100:   "#dcfce7",
          200:   "#bbf7d0",
          500:   "#22c55e",
          600:   "#16a34a",
          700:   "#15803d",
          800:   "#166534",
          900:   "#14532d",
        },
        sand: "#f7f5f0",
        moss: "#52796f",
        sage: "#84a98c",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in":       "fadeIn 0.4s ease-out",
        "slide-up":      "slideUp 0.4s ease-out",
        "slide-right":   "slideRight 0.3s ease-out",
        "scale-in":      "scaleIn 0.35s ease-out",
        "bounce-soft":   "bounceSoft 0.5s ease-out",
        "spin-slow":     "spin 1.8s linear infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" },                             to: { opacity: "1" } },
        slideUp:   { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideRight:{ from: { opacity: "0", transform: "translateX(24px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        scaleIn:   { from: { opacity: "0", transform: "scale(0.92)" },   to: { opacity: "1", transform: "scale(1)" } },
        bounceSoft:{ "0%": { transform: "scale(0.8)", opacity: "0" }, "60%": { transform: "scale(1.08)" }, "100%": { transform: "scale(1)", opacity: "1" } },
      },
      boxShadow: {
        card:       "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-md":  "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
        "card-lg":  "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)",
        brand:      "0 4px 14px rgba(26,71,42,0.28)",
        "brand-lg": "0 8px 24px rgba(26,71,42,0.32)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
