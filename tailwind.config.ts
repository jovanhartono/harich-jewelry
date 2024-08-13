import type { Config } from "tailwindcss";

const { nextui } = require("@nextui-org/react");
const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  corePlugins: {
    container: false,
  },
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F9F6EE",
        sandy: "#CDC6BB",
        clay: "#ACABA6",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    nextui({
      themes: {
        light: {
          colors: {
            secondary: "#CDC6BB",
            focus: "#ACABA6",
            background: "#FFFFFF",
            foreground: "#1A1A1A",
            primary: {
              DEFAULT: "#EDE8D0",
              foreground: "#1A1A1A",
            },
          },
        },
      },
    }),
  ],
} satisfies Config;

export default config;
