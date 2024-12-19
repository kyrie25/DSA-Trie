<template>
	<div class="container gap-4 mt-10">
		<span v-if="words.length" class="text-gray-500"> {{ words.length }} words found in {{ time.toFixed(10) }}ms </span>
		<div class="flex flex-wrap gap-4 mt-4">
			<div v-if="!words.length && search.trim()" class="text-gray-500">No words found</div>
			<div
				v-for="word in words"
				:key="word"
				class="flex items-center gap-4 p-4 border rounded-3xl shadow-md transition-all duration-300 hover:scale-105 hover:border-error"
			>
				{{ word }}
				<button @click="removeWord(word)" class="btn btn-sm btn-outline btn-error">
					<v-icon name="bi-trash" />
				</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "List",
	props: {
		words: Array,
		time: Number,
		search: String,
	},
	emits: ["remove", "update:search"],
	setup(props, { emit }) {
		const removeWord = (word) => {
			emit("remove", word);
		};

		return { removeWord };
	},
};
</script>
