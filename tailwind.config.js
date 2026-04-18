/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        text: {
          DEFAULT: "hsl(var(--text) / <alpha-value>)",
          secondary: "hsl(var(--text-secondary) / <alpha-value>)",
          tertiary: "hsl(var(--text-tertiary) / <alpha-value>)",
        },
        muted: "hsl(var(--text-secondary) / <alpha-value>)", // Alias for backward compatibility
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        success: "hsl(var(--success) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        destructive: "hsl(var(--destructive) / <alpha-value>)",

        // Aliases for potential legacy usage
        positive: "hsl(var(--success) / <alpha-value>)",
        negative: "hsl(var(--destructive) / <alpha-value>)",
      },
      fontFamily: {
        space: ["Space Grotesk", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0, 0, 0, 0.15)",
        glow: "0 0 24px hsla(217, 91%, 60%, 0.25)",
        "glow-success": "0 0 20px hsla(142, 71%, 55%, 0.25)",
        "glow-destructive": "0 0 20px hsla(0, 84%, 70%, 0.25)",
        "glow-accent": "0 0 20px hsla(262, 83%, 65%, 0.25)",
        "card-hover": "0 8px 32px rgba(0, 0, 0, 0.2)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
