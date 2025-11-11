/** @type {import('tailwindcss').Config} */
// tailwind.config.js
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Redefine los colores de Tailwind para que apunten a tus variables CSS
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        text: {
          DEFAULT: "var(--color-text-default)",
          secondary: "var(--color-text-secondary)",
        },
        background: {
          DEFAULT: "var(--color-background-default)",
          secondary: "var(--color-background-secondary)",
        },
        border: "var(--color-border)",
        success: "var(--color-success)",
        error: "var(--color-error)",
      },
    },
  },
  plugins: [],
};
