/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.vue", "./src/**/*.js", "./src/**/*.ts"],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["light", "dark"],
	},
};
