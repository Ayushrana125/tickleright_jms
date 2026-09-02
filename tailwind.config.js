export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        coral: {
          50: "#fff1f4",
          100: "#ffdfe7",
          500: "#e85c7b",
          600: "#d84467",
        },
        skysoft: "#a8d8e8",
        marigold: "#f5a94e",
        ink: "#30313d",
      },
      boxShadow: {
        soft: "0 14px 40px rgba(48, 49, 61, 0.08)",
      },
    },
  },
  plugins: [],
};
