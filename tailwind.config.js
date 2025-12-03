/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#FF1F6C', // Envy Pink
                secondary: '#50D2C1', // Envy Teal
                accent: '#D6FE51', // Envy Lime
                dark: '#000000', // Black text
                light: '#EDEDED', // Light background
                surface: '#FFFFFF', // White for cards
                textMain: '#000000',
                textMuted: '#666666',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
