/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'laeq-dark': '#001D3D',     // Azul Medianoche
        'laeq-blue': '#003566',     // Azul Corporativo
        'laeq-cyan': '#00A8E8',     // Celeste Energía
        'laeq-light': '#E1EFF6',    // Fondo Aireado
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Geist', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
