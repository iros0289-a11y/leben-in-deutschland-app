import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16313d",
        paper: "#f7faf8",
        civic: "#007c83",
        mint: "#2f7d32",
        coral: "#dc2626",
        amberline: "#d97706"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(22, 49, 61, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
