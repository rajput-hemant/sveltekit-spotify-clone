/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				background: 'rgb(var(--background) / <alpha-value>)',
				sidebar: 'rgb(var(--sidebar) / <alpha-value>)',
				header: 'rgb(var(--header) / <alpha-value>)',
				text: 'rgb(var(--text) / <alpha-value>)',
				accent: 'rgb(var(--accent) / <alpha-value>)',
				'menu-bg': 'rgb(var(--menu-bg) / <alpha-value>)',
				'menu-text': 'rgb(var(--menu-text) / <alpha-value>)',
				'light-gray': 'rgb(var(--light-gray) / <alpha-value>)',
				'medium-gray': 'rgb(var(--medium-gray) / <alpha-value>)',
				'dark-gray': 'rgb(var(--dark-gray) / <alpha-value>)',
				error: 'rgb(var(--error) / <alpha-value>)',
				warning: 'rgb(var(--warning) / <alpha-value>)'
			}
		},
		fontFamily: {
			metropolis: ['Metropolis', 'sans-serif']
		}
	},
	plugins: []
};
