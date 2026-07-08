import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        paper: "#f7f8f6",
        civic: "#2563eb",
        mint: "#0f766e",
        coral: "#dc2626",
        amberline: "#d97706"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 32, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
