import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand: Deep Trust Blue
        primary: {
          DEFAULT: "#1E3A5F",
          50: "#EEF3F9",
          100: "#D8E3F0",
          200: "#AFC6E0",
          300: "#7FA3CB",
          400: "#4F7EB2",
          500: "#33628F",
          600: "#274E75",
          700: "#1E3A5F",
          800: "#162C4A",
          900: "#0E1F35",
        },
        // Brand: Growth Green
        growth: {
          DEFAULT: "#2E7D32",
          50: "#EDF7EE",
          100: "#D3EBD5",
          200: "#A6D7AB",
          300: "#74BF7C",
          400: "#4CA354",
          500: "#2E7D32",
          600: "#276B2B",
          700: "#1F5622",
          800: "#17411A",
          900: "#0F2C11",
        },
        // Brand: Premium Gold
        gold: {
          DEFAULT: "#FFC107",
          50: "#FFF8E1",
          100: "#FFECB3",
          200: "#FFE082",
          300: "#FFD54F",
          400: "#FFCA28",
          500: "#FFC107",
          600: "#E0A800",
          700: "#B38600",
          800: "#866400",
          900: "#594300",
        },
        ink: "#333333",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "float-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "100%": { transform: "scale(1.08) translate(-1.5%, -1%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        "fade-in": "fade-in 0.9s ease-out both",
        "float-soft": "float-soft 6s ease-in-out infinite",
        "ken-burns": "ken-burns 4.2s ease-out both",
      },
      boxShadow: {
        card: "0 4px 24px -6px rgba(30, 58, 95, 0.12)",
        "card-hover": "0 12px 40px -8px rgba(30, 58, 95, 0.22)",
      },
    },
  },
  plugins: [],
};
export default config;
