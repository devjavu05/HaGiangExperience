/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', "Inter", "system-ui", "sans-serif"]
      },
      colors: {
        hagiang: {
          sage: "#E8F3EE",
          terracotta: "#FDF2E9",
          sky: "#EBF5FF",
          sand: "#F9F6F2",
          ink: "#1A3021"
        },
        surface: {
          base: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0"
        },
        ink: {
          primary: "#0F172A",
          secondary: "#475569",
          accent: "#1A3021"
        },
        forest: {
          50: "#edf4ee",
          100: "#d5e6d7",
          300: "#91b195",
          700: "#3d5b42",
          800: "#294231",
          900: "#1f3325"
        },
        terracotta: {
          100: "#f3ddd0",
          400: "#d4885f",
          700: "#9c4f2b"
        },
        clay: {
          50: "#f8f3ec",
          100: "#f0e6d9",
          200: "#e1d0bc",
          300: "#ccb59d"
        }
      }
    }
  },
  plugins: []
};
