<template>
	<div class="flex flex-col gap-6 items-center max-w-80 mx-auto select-none">
		<div class="container">
			<label class="text-sm font-semibold">Limit</label>
			<div class="tooltip max-sm:tooltip-right" data-tip="Set the limit of words to look for">
				<v-icon name="bi-question-circle" class="text-primary ml-2 cursor-help" />
			</div>
			<input type="range" class="range range-secondary w-80 mt-1" min="20" max="100" step="20" v-model="value" @input="handleInput" />
			<div class="flex w-full justify-between px-2 text-xs">
				<span>20</span>
				<span>40</span>
				<span>60</span>
				<span>80</span>
				<span>100</span>
			</div>
		</div>
		<div class="md:max-2xl:tooltip tooltip-bottom" data-tip="Choose the algorithm to use">
			<label class="flex flex-row gap-4 cursor-pointer">
				<span class="text-sm font-semibold">Trie</span>
				<input v-model="mode" type="checkbox" class="toggle border-accent bg-accent hover:bg-accent" @change="handleToggle" />
				<span class="text-sm font-semibold">Linear</span>
			</label>
		</div>
	</div>
</template>

<script>
import { ref } from "vue";
export default {
	name: "Filter",
	props: {
		limit: Number,
		mode: String,
	},
	emits: ["update:limit", "update:mode"],
	setup(props, { emit }) {
		const value = ref(props.limit);

		const handleInput = (e) => {
			emit("update:limit", parseInt(e.target.value));
			value.value = e.target.value;
		};

		const mode = ref(props.mode);

		const handleToggle = () => {
			emit("update:mode", mode.value ? "linear" : "trie");
		};

		return { value, handleInput, handleToggle, mode };
	},
};
</script>
