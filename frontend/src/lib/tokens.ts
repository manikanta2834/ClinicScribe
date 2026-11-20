/**
 * ClinicScribe Centralized Design Token System
 * Strict compliance with brand palette and glassmorphism specifications.
 */

export const clinicTokens = {
  colors: {
    seafoam: "#BFE1E0",       // Seafoam Aqua
    mist: "#E2F0F1",          // Pale Mist
    softWhite: "#F1F6F9",     // Soft White
    deepTeal: "#267C78",      // Deep Teal
    oceanTeal: "#48B7A0",     // Ocean Teal
    evergreen: "#075D55",     // Dark Evergreen
    mint: "#0B927F",          // Mint Green
    slate: "#607D7B",         // Muted Slate
  },
  glass: {
    background: "rgba(255, 255, 255, 0.85)",
    backgroundHover: "rgba(255, 255, 255, 0.95)",
    border: "1px solid rgba(72, 183, 160, 0.22)",
    borderSubtle: "1px solid rgba(191, 225, 224, 0.35)",
    blur: "blur(20px)",
    shadow: "0 8px 32px 0 rgba(7, 93, 85, 0.08)",
    shadowHover: "0 12px 36px 0 rgba(7, 93, 85, 0.14)",
  },
  sidebar: {
    gradient: "linear-gradient(180deg, #075D55 0%, #0B927F 100%)",
    activePill: "rgba(255, 255, 255, 0.18)",
    hoverPill: "rgba(255, 255, 255, 0.09)",
  },
  radii: {
    sm: "12px",
    md: "16px",
    lg: "20px",
    xl: "24px",
    pill: "9999px",
  },
} as const;

