import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0B1120",      // Deep Navy Black
          card: "#1e293b",    // Slate 800 for cards
          text: "#f8fafc",    // Slate 50 for text
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        barlow: ["var(--font-barlow)"],
        raleway: ["var(--font-raleway)"],
      },
    },
  },
  plugins: [],
};

export default config;