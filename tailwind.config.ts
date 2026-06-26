import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FDF8F3",
          100: "#FAF0E6",
          200: "#F5E6D3",
          300: "#EDD5B8",
        },
        terracotta: {
          50: "#FDF5F0",
          100: "#FAE8DC",
          200: "#F2CDB3",
          300: "#E8A87C",
          400: "#D4845A",
          500: "#C0603C",
          600: "#A04D2E",
          700: "#7D3C24",
          800: "#5C2C1A",
          900: "#3D1D11",
        },
        amber: {
          warm: "#D4A574",
          deep: "#B8860B",
        },
        earth: {
          50: "#F7F3EF",
          100: "#EDE4D9",
          200: "#D9C9B8",
          300: "#C4A98E",
          400: "#A68B6A",
          500: "#8B6F47",
          600: "#6B5535",
          700: "#4D3D26",
          800: "#332818",
          900: "#1A140C",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-lato)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
