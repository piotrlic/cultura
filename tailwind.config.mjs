/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#F5C518", // IMDb yellow
        secondary: "#121212", // IMDb dark background
        "secondary-light": "#1F1F1F", // Slightly lighter dark background
        "text-primary": "#FFFFFF", // White text
        "text-secondary": "#CCCCCC", // Light gray text
        accent: "#E2B616", // Darker yellow for hover states
      },
    },
  },
  plugins: [],
}
