export default {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  safelist: [
    "columns-1",
    "columns-2",
    "columns-3",
    "columns-4",
    "columns-5",
    "columns-6",
  ],
  plugins: [require("@tailwindcss/typography")],
};
