import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { ink: "#080807", bone: "#f3ecdc", acid: "#d8ff3f", clay: "#c46243", tide: "#85dfd0", soot: "#171615" },
      fontFamily: {
        sans: ["var(--font-geist)", "Arial", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Consolas", "monospace"]
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } }
      },
      animation: {
        marquee: "marquee 24s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
