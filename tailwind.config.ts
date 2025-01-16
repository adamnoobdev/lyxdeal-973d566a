import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#520053",
          foreground: "#FFFFFF",
          50: "#FFE6FF",
          100: "#FEB4FF",
          200: "#FA74FF",
          300: "#E455E5",
          400: "#B944BA",
          500: "#520053",
          600: "#470047",
          700: "#3C003D",
          800: "#310032",
          900: "#260027",
        },
        secondary: {
          DEFAULT: "#FEB4FF",
          foreground: "#520053",
          50: "#FFF1FF",
          100: "#FFE4FF",
          200: "#FEB4FF",
          300: "#FDA4FF",
          400: "#FC94FF",
          500: "#FB84FF",
          600: "#FA74FF",
          700: "#F964FF",
          800: "#F854FF",
          900: "#F744FF",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        accent: {
          DEFAULT: "#520053",
          foreground: "#FFFFFF",
          50: "#FFE6FF",
          100: "#FEB4FF",
          200: "#FA74FF",
          300: "#E455E5",
          400: "#B944BA",
          500: "#520053",
          600: "#470047",
          700: "#3C003D",
          800: "#310032",
          900: "#260027",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(5px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.15s ease-out",
        "accordion-up": "accordion-up 0.15s ease-out",
        "fade-up": "fade-up 0.3s ease-out forwards",
        gradient: "gradient 12s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;