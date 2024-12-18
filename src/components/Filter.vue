<template>
	<div class="flex flex-col gap-6 items-center max-w-80 mx-auto">
		<div class="container">
			<label class="text-sm font-semibold">Limit</label>
			<input type="range" class="range range-secondary w-80 mt-1" min="20" max="100" step="20" v-model="value" @input="handleInput" />
			<div class="flex w-full justify-between px-2 text-xs">
				<span>20</span>
				<span>40</span>
				<span>60</span>
				<span>80</span>
				<span>100</span>
			</div>
		</div>
		<label className="flex flex-row gap-4 cursor-pointer place-items-center">
			<span class="text-sm font-semibold">Trie</span>
			<input v-model="mode" type="checkbox" className="toggle border-accent bg-accent hover:bg-accent" @change="handleToggle" />
			<span class="text-sm font-semibold">Linear</span>
		</label>
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
