<template>
	<header class="navbar container mx-auto px-4 pt-5">
		<div class="navbar-start gap-2">
			<v-icon name="bi-book" class="text-blue-500 pt-1" scale="2" />
			<span class="self-center text-2xl font-semibold whitespace-nowrap hover:text-blue-500 transition-colors hidden lg:block">Word Finder</span>
			<span class="text-pretty text-sm text-gray-500 hidden lg:block pt-2">
				by <a href="https://kyrie25.dev" target="_blank" class="text-blue-500">kyrie25</a>
			</span>
		</div>
		<div className="navbar-end space-x-4">
			<!-- GitHub button-->
			<a href="https://github.com/kyrie25/DSA-Trie" target="_blank" class="btn"><v-icon name="bi-github" /> Source code </a>

			<label className="grid cursor-pointer place-items-center">
				<input
					v-model="theme"
					type="checkbox"
					className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
					@change="toggleTheme"
				/>
				<v-icon name="bi-moon-fill" class="fill-base-100 col-start-1 row-start-1" />
				<v-icon name="bi-sun-fill" class="fill-base-100 col-start-2 row-start-1" />
			</label>
		</div>
	</header>
</template>

<script>
import { onMounted, ref } from "vue";
export default {
	name: "Header",
	setup() {
		let theme = ref(false);
		const toggleTheme = () => {
			const value = theme.value ? "light" : "dark";
			// Add data tag to HTML
			document.documentElement.dataset.theme = value;
			localStorage.setItem("theme", value);
		};

		onMounted(() => {
			const storedTheme = localStorage.getItem("theme");
			if (storedTheme) {
				console.log(storedTheme);
				document.documentElement.dataset.theme = storedTheme;
				theme.value = storedTheme === "light";
			} else {
				// Follow system theme
				const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
				document.documentElement.dataset.theme = systemTheme ? "dark" : "light";
				theme.value = systemTheme;
			}
		});

		return { theme, toggleTheme };
	},
};
</script>
