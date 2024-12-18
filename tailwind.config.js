/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.vue", "./src/**/*.js", "./src/**/*.ts"],
	theme: {
		extend: {
			animation: {
				"toast-out": "toast-out 0.25s ease-out",
			},
			keyframes: {
				"toast-out": {
					"0%": { opacity: 1, transform: "scale(1)" },
					"100%": { opacity: 0, transform: "scale(0.9)" },
				},
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["light", "dark"],
	},
};
