import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  corePlugins: {
    preflight: false, // Disable Tailwind's base reset to avoid conflicts with Chakra UI
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
