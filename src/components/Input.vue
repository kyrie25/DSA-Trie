<template>
	<div class="flex flex-row items-center justify-center gap-4 w-full">
		<label class="input input-bordered input-primary flex items-center gap-2">
			<input type="text" class="grow" v-model="search" @input="handleInput" placeholder="Search for a word" />
			<span class="ml-2">
				<v-icon :name="search ? 'bi-x-lg' : 'bi-search'" @click="clear" :class="{ 'cursor-pointer': search }" />
			</span>
		</label>
		<button class="btn btn-primary" @click="handleAdd">
			<v-icon name="bi-plus-circle" />
		</button>
	</div>
</template>

<script>
import { ref } from "vue";
export default {
	name: "InputBar",
	props: {
		modelValue: String,
	},
	emits: ["update:modelValue", "add"],
	setup(props, { emit }) {
		const search = ref(props.modelValue);
		const intervalId = ref(null);

		const handleInput = (e) => {
			if (intervalId.value) {
				clearInterval(intervalId.value);
			}
			setInterval(() => {
				emit("update:modelValue", e.target.value);
			}, 200);
		};

		const handleAdd = () => {
			emit("add", search.value);
		};

		const clear = () => {
			search.value = "";
			emit("update:modelValue", "");
		};

		return { search, handleInput, handleAdd, clear };
	},
};
</script>
