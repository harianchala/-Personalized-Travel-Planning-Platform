/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}, // ✅ correct for Tailwind v4
    autoprefixer: {},           // keep autoprefixer too
  },
};

export default config;
