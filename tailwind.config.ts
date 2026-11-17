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
        primary: {
          DEFAULT: "var(--tenant-primary, #a83832)",
          hover: "#8c2e29",
          ink: "#a83832",
          light: "#fbf2f2",
        },
        surface: {
          DEFAULT: "#ffffff",
          premium: "#0f172a",
          dark: "#0b0f19",
          container: "#f8fafc",
          "container-low": "#f1f5f9",
          variant: "#94a3b8",
        },
        accent: {
          DEFAULT: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
