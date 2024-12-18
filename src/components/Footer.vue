<template>
	<footer className="flex navbar container p-4 mx-auto md:p-6 flex-row-reverse gap-2">
		<code>
			<a
				v-if="commit"
				:href="'https://github.com/kyrie25/DSA-Trie/commit/' + commit"
				className="hover:text-blue-500 transition-colors text-xs"
				rel="noreferrer noopener"
				target="_blank"
			>
				{process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7)}
			</a>
			<span v-else>local</span>
		</code>
		<v-icon name="oi-git-commit" />
	</footer>
</template>

<script setup>
// Get process.env from Vite

const commit = import.meta.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
</script>
