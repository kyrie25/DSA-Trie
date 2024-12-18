<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import InputBar from "./components/Input.vue";
import Filter from "./components/Filter.vue";
import List from "./components/List.vue";

import { Dictionary } from "./classes/dictionary";
import { Trie } from "./classes/trie";

import { ref, watchEffect } from "vue";
import { LinearSearch } from "./classes/linear-search";

// State
const loading = ref(true);
const toasts = ref([]);

// Input
const search = ref("");
const limit = ref(20);
const mode = ref("trie");

// Results
const dict = ref(null);
const trie = ref(null);
const linear = ref(null);
const words = ref([]);
const time = ref(0);

const showToast = (message, type, icon) => {
	toasts.value.push({ message, type, icon });
	setTimeout(() => {
		toasts.value.shift();
	}, 5000);
};

// Fetch dictionary data
(async () => {
	const rawDict = await fetch("words_alpha.txt").then((res) => res.text());
	const dictionary = new Dictionary(rawDict);
	dict.value = dictionary;
	trie.value = new Trie(dictionary);
	linear.value = new LinearSearch(dictionary);
	loading.value = false;
})();

watchEffect(() => {
	console.log(limit.value, mode.value);
	if (!search.value || !trie.value) {
		words.value = [];
		return;
	}

	const startTime = performance.now();
	switch (mode.value) {
		case "trie":
			words.value = trie.value.search(search.value.trim(), limit.value);
			break;
		case "linear":
			words.value = linear.value.search(search.value.trim(), limit.value);
			break;
		default:
			words.value = trie.value.search(search.value.trim(), limit.value);
			break;
	}
	const endTime = performance.now();

	time.value = endTime - startTime;
});

const addWord = (word) => {
	if (!word) {
		showToast("Please enter a word", "warning", "bi-exclamation-circle");
		return;
	}

	if (dict.value.contains(word)) {
		showToast(`Word "${word}" already exists`, "info", "bi-info-circle");
		return;
	}
	dict.value.add(word);
	trie.value.add(word);
	linear.value.add(word);

	showToast(`Word "${word}" added`, "success", "bi-plus-circle");
};

const removeWord = (word) => {
	dict.value.remove(word);
	trie.value.remove(word);
	linear.value.remove(word);

	showToast(`Word "${word}" removed`, "error", "bi-trash");
};
</script>

<template>
	<div class="toast toast-top toast-center z-50">
		<div
			v-for="toast in toasts"
			:key="toast.message"
			:class="{
				alert: true,
				'alert-info': toast.type === 'info',
				'alert-success': toast.type === 'success',
				'alert-error': toast.type === 'error',
				'alert-warning': toast.type === 'warning',
			}"
		>
			<v-icon v-if="toast.icon" :name="toast.icon" />
			{{ toast.message }}
		</div>
	</div>
	<Header />
	<main class="flex flex-col min-h-[calc(100vh-76px-72px)] items-center relative">
		<div class="container mx-auto px-4 pt-5">
			<div class="flex flex-col items-center justify-center gap-4">
				<h1 class="text-4xl font-bold">Word Finder</h1>
				<p class="text-lg">Simple word suggestion program that uses Trie and Linear Search algorithm.</p>

				<InputBar v-model="search" @add="addWord" />

				<Filter :limit="limit" :mode="mode" @update:limit="limit = $event" @update:mode="mode = $event" />

				<div v-if="loading" class="mt-10">
					<span class="loading loading-spinner loading-lg" />
				</div>
				<!-- List words -->
				<List v-else :words="words" :time="time" :search="search" @remove="removeWord" />
			</div>
		</div>
	</main>
	<Footer />
</template>
