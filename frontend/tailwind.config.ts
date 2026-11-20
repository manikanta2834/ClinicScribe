import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ClinicScribe Brand Palette
        brand: {
          seafoam: "#BFE1E0",       // Seafoam Aqua
          mist: "#E2F0F1",          // Pale Mist
          softWhite: "#F1F6F9",     // Soft White
          deepTeal: "#267C78",      // Deep Teal
          oceanTeal: "#48B7A0",     // Ocean Teal
          evergreen: "#075D55",     // Dark Evergreen
          mint: "#0B927F",          // Mint Green
          slate: "#607D7B",         // Muted Slate
        },
      },
      borderRadius: {
        "xl": "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(7, 93, 85, 0.08)",
        "glass-hover": "0 12px 40px 0 rgba(7, 93, 85, 0.14)",
        "glass-active": "0 4px 16px 0 rgba(7, 93, 85, 0.12)",
      },
      backdropBlur: {
        "glass": "18px",
      },
    },
  },
  plugins: [],
};

export default config;

