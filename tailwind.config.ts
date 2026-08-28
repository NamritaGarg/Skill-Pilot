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
        dim: {
          bg: "#0c0c0e",       // Soft dark grey / near black background
          surface: "#141418",  // Dim surface
          card: "#1b1b22",     // Subtle dark card surface
          border: "#282834",   // Low-strain soft border
          hover: "#22222b",    // Interactive hover state
        },
        champagne: {
          DEFAULT: "#dfb76c", // Primary gold / champagne accent
          light: "#f2d49b",   // Soft champagne highlight
          dark: "#b88c42",    // Deep champagne border / shadow
          glow: "rgba(223, 183, 108, 0.15)",
        },
        cream: {
          DEFAULT: "#f7f5ed", // Warm paper cream
          dark: "#ede8da",
          ink: "#1c1b18",     // Dark ink text for warm cream elements
        },
      },
      fontFamily: {
        serif: ["var(--font-roboto-slab)", "Roboto Slab", "Playfair Display", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        'modern': '7px',
      },
      backgroundImage: {
        'radial-spotlight': 'radial-gradient(circle at 50% 0%, rgba(223, 183, 108, 0.18) 0%, rgba(12, 12, 14, 0.95) 60%, #0c0c0e 100%)',
        'gold-gradient': 'linear-gradient(135deg, #dfb76c 0%, #f2d49b 50%, #b88c42 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(27, 27, 34, 0.8) 0%, rgba(20, 20, 24, 0.9) 100%)',
      },
      boxShadow: {
        'champagne-sm': '0 2px 10px rgba(223, 183, 108, 0.12)',
        'champagne-glow': '0 0 25px rgba(223, 183, 108, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
