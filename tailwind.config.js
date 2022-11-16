const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /(bg|text)-(purple|fuchsia|teal|slate)-.+/,
      variants: ["hover"],
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
    animation: {
      "spin-slow": "spin 3s linear infinite",
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@headlessui/tailwindcss")],
};
