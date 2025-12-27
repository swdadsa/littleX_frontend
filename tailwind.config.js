/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["\"Space Grotesk\"", "ui-sans-serif", "system-ui"],
        serif: ["\"Instrument Serif\"", "ui-serif"]
      },
      colors: {
        lx: {
          bg: "#f4efe9",
          bgAlt: "#efe6dc",
          ink: "#1e1c1a",
          muted: "#6b5f53",
          line: "#e1d6c9",
          accent: "#ef6f4c",
          accentStrong: "#d85733",
          teal: "#1f8a8c",
          card: "#fffaf4"
        }
      },
      boxShadow: {
        soft: "0 24px 60px rgba(30, 28, 26, 0.12)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "float-in": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.6s ease forwards",
        "float-in": "float-in 0.6s ease forwards"
      }
    }
  },
  plugins: []
};
