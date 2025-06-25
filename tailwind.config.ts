import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        chiliz: {
          primary: '#E50046',
          secondary: '#FF4EB5',
          dark: '#0B0C10',
          gray: '#1E1E2F',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "chiliz-gradient": "radial-gradient(circle at 50% 30%, #1E1E2F 0%, #0B0C10 50%, #E50046 85%, #FF4EB5 100%)",
      },
      boxShadow: {
        'glow': '0 0 20px rgba(229, 0, 70, 0.4)',
        'glow-secondary': '0 0 20px rgba(255, 78, 181, 0.4)',
      },
    },
  },
  plugins: [],
};
export default config;
