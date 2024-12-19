<template>
	<footer class="flex navbar container p-4 mx-auto md:p-6 flex-row-reverse gap-2">
		<code>
			<a
				v-if="commit"
				:href="'https://github.com/kyrie25/DSA-Trie/commit/' + commit"
				class="hover:text-blue-500 transition-colors text-xs"
				rel="noreferrer noopener"
				target="_blank"
			>
				{{ commit.slice(0, 7) }}
			</a>
			<span class="text-xs" v-else>local</span>
		</code>
		<v-icon name="oi-git-commit" />
	</footer>
</template>

<script setup>
// Get process.env from Vite
const commit = import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA;
</script>
