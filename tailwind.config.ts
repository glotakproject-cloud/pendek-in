import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: "#F5F5F0",
        brutal: {
          green: "#00D26A",
          "green-dark": "#00A653",
          lime: "#B4FF39",
          black: "#0A0A0A",
          cream: "#F5F5F0",
          white: "#FFFFFF",
          red: "#FF5C5C",
          yellow: "#FFD23F",
          blue: "#3B82F6",
        },
        primary: {
          DEFAULT: "#00D26A",
          foreground: "#0A0A0A",
          dark: "#00A653",
        },
        secondary: {
          DEFAULT: "#B4FF39",
          foreground: "#0A0A0A",
        },
        accent: {
          DEFAULT: "#B4FF39",
          foreground: "#0A0A0A",
        },
        destructive: {
          DEFAULT: "#FF5C5C",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#FFD23F",
          foreground: "#0A0A0A",
        },
        info: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0A0A0A",
        },
        muted: {
          DEFAULT: "#F5F5F0",
          foreground: "#666666",
        },
        border: "#0A0A0A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        archivo: ["var(--font-archivo-black)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #0A0A0A",
        "brutal-sm": "2px 2px 0px 0px #0A0A0A",
        "brutal-lg": "6px 6px 0px 0px #0A0A0A",
        "brutal-xl": "8px 8px 0px 0px #0A0A0A",
        "brutal-green": "4px 4px 0px 0px #00D26A",
        "brutal-lime": "4px 4px 0px 0px #B4FF39",
      },
      borderWidth: {
        3: "3px",
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
