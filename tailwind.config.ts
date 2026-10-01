import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10263D",
        ocean: "#0E7490",
        mint: "#D8F3EE",
        sand: "#FFF8EE",
        coral: "#E76F51",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(16, 38, 61, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
