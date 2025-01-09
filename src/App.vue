<script setup>
import { ref, triggerRef, watchEffect } from "vue";

import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import InputBar from "./components/Input.vue";
import Filter from "./components/Filter.vue";
import List from "./components/List.vue";
import Benchmark from "./components/Benchmark.vue";

import { Dictionary } from "./classes/dictionary";
import { Trie } from "./classes/trie";
import { TernarySearchTree } from "./classes/ternary-tree";

const tabs = {
	finder: "Word finder",
	test: "Benchmark",
};
const modes = {
	trie: "Trie",
	ternary: "Ternary",
};

// State
const loading = ref(true);
const toasts = ref([]);
const tab = ref(Object.keys(tabs)[0]);

// Input
const search = ref("");
const limit = ref(20);
const mode = ref(Object.keys(modes)[0]);

// Classes
const dict = ref(null);

// Do not use ref for performance overhead
let trie = null;
let ternary = null;

// State
// const height = ref(0);
// const nodes = ref(0);

// Output
const words = ref([]);
const comparisons = ref(0);
const time = ref(0);

const showToast = (message, type, icon) => {
	toasts.value.push({ message, type, icon });
	setTimeout(() => {
		const top = toasts.value[0];
		top.animateOut = true;
		setTimeout(() => {
			toasts.value.shift();
		}, 500);
	}, 5000);
};

// Fetch dictionary data
(async () => {
	const rawDict = await fetch("english-words/words_alpha.txt")
		.then((res) => {
			if (!res.ok) {
				throw new Error("Failed to fetch dictionary data");
			}
			return res.text();
		})
		.catch((err) => {
			console.error(err);
			showToast("Failed to fetch dictionary data", "error", "bi-exclamation-circle");
		});

	if (!rawDict) {
		return;
	}

	const dictionary = new Dictionary(rawDict);

	dict.value = dictionary;
	trie = new Trie(dictionary);
	ternary = new TernarySearchTree(dictionary);

	// height.value = trie.height;
	// nodes.value = trie.nodes;

	loading.value = false;

	// Expose to window for debugging
	window.Dictionary = dictionary;
	window.Trie = trie;
	window.TernarySearchTree = ternary;

	showToast(`Dictionary loaded, ${dictionary.length} words count`, "success", "bi-check-circle");
})();

const findWord = () => {
	if (!search.value || !trie) {
		words.value = [];
		comparisons.value = 0;
		return;
	}

	let res;
	const startTime = performance.now();
	switch (mode.value) {
		case "ternary":
			res = ternary.search(search.value.trim(), limit.value);
			break;
		case "trie":
		default:
			res = trie.search(search.value.trim(), limit.value);
			break;
	}
	const endTime = performance.now();

	// Update output
	words.value = res.words;
	comparisons.value = res.comparisons;
	time.value = endTime - startTime;
};

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
	trie.add(word);
	ternary.add(word);

	findWord();

	showToast(`Word "${word}" added`, "success", "bi-plus-circle");
};

const removeWord = (word) => {
	dict.value.remove(word);
	trie.remove(word);
	ternary.remove(word);

	findWord();

	showToast(`Word "${word}" removed`, "error", "bi-trash");
};

const toggleTab = (mode) => {
	tab.value = mode;
};

watchEffect(findWord);
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
				'animate-toast-out': toast.animateOut,
				'opacity-0': toast.animateOut,
			}"
		>
			<v-icon v-if="toast.icon" :name="toast.icon" />
			{{ toast.message }}
		</div>
	</div>
	<Header />
	<main class="flex flex-col min-h-[calc(100dvh-76px-72px)] items-center relative">
		<div class="container mx-auto px-4 pt-5">
			<div class="flex flex-col items-center justify-center gap-4">
				<h1 class="text-4xl font-bold">Word Finder</h1>
				<p class="text-lg">Simple word suggestion program that uses Trie and Ternary Search Tree.</p>

				<div role="tablist" class="tabs tabs-boxed">
					<a v-for="t in Object.keys(tabs)" :key="t" role="tab" :class="{ tab: true, 'tab-active': tab === t }" @click="toggleTab(t)">{{
						tabs[t]
					}}</a>
				</div>

				<template v-if="tab === 'test'">
					<Benchmark :loading="loading" :dict="dict" :algorithms="[trie, ternary]" />
				</template>

				<template v-if="tab === 'finder'">
					<InputBar v-model="search" @add="addWord" />

					<Filter :limit="limit" :modes="modes" :mode="mode" @update:limit="limit = $event" @update:mode="mode = $event" />

					<div v-if="loading" class="mt-10">
						<span class="loading loading-spinner loading-lg" />
					</div>
					<!-- List words -->
					<List v-else :words="words" :comparisons="comparisons" :time="time" :search="search" @remove="removeWord" />
				</template>
			</div>
		</div>
	</main>
	<Footer />
</template>
