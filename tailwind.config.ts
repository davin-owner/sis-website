import type { Config } from "tailwindcss";

export default {
  darkMode: [
    "variant",
    [
      '@media (prefers-color-scheme: dark) { &:not([data-theme="light"]) }',
      '&:is([data-theme="dark"] *)',
    ],
  ],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Colors reference CSS variables from globals.css
      // This way you only change colors in ONE place (globals.css)
      colors: {
        // Theme-aware colors (auto-switch with theme toggle)
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        "text-muted": "var(--color-text-muted)",
        "accent-primary": "var(--color-accent-primary)",
        "accent-secondary": "var(--color-accent-secondary)",
        "accent-hover": "var(--color-accent-hover)",

        // Shadcn/UI semantic color tokens for components
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
      },
      borderRadius: {
        lg: "var(--radius-card)",
        md: "calc(var(--radius-card) - 2px)",
        sm: "calc(var(--radius-card) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
