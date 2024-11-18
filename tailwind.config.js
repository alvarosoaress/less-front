/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";
export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
          colors: {
            primary: "#000",
            bgPrimary: "#000",
            textSecondary: "#000",
            textLink: "#000",
            bgSecondary: "#F9F8FE",
            subtleBlack: "#2B2B33",
            lightGray: "#cccccc",
            btnBlue: "#000",
          },
          animation: {
            jump: "jump 500ms ease-in-out infinite",
          },
          keyframes: {
            jump: {
              "0%, 100%": {
                transform: "translateY(0)",
              },
              "50%": {
                transform: "translateY(-10px)",
              },
            },
          },
        },
      },
      plugins: [
        require('@tailwindcss/aspect-ratio'),
        plugin(({ matchUtilities, theme }) => {
          matchUtilities(
            {
              "animation-delay": (value) => {
                return {
                  "animation-delay": value,
                };
              },
            },
            {
              values: theme("transitionDelay"),
            },
          );
        }),
      ],
}
