/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#0f172a', // Slate 950
                    gold: '#f59e0b', // Amber 500
                    light: '#f8fafc', // Slate 50
                    primary: '#f59e0b',
                    secondary: '#0f172a',
                    accent: '#f59e0b',
                }
            }
        },
    },
    plugins: [],
}
