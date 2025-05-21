/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                'bistro-primary': '#C6632C',
                'bistro-secondary': '#FAF5E4',
            },
        },
    },
    plugins: [],
};