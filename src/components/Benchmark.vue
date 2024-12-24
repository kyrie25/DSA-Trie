<template>
	<div class="container flex flex-wrap flex-col justify-center items-center text-center gap-4">
		<!-- Config -->
		<div class="flex flex-row justify-center gap-6 w-full">
			<div>
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">Total</span>
					</div>
					<input id="total" type="number" min="1" v-model="total" class="input input-bordered input-primary w-full max-w-xs" placeholder="1000" />
					<div class="label">
						<span class="label-text-alt">Number of runs to perform</span>
					</div>
				</label>
			</div>

			<div>
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">Limit</span>
					</div>
					<input id="limit" type="number" min="1" v-model="limit" class="input input-bordered input-primary w-full max-w-xs" placeholder="10" />
					<div class="label">
						<span class="label-text-alt">Number of words to return per run</span>
					</div>
				</label>
			</div>

			<div>
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">String length</span>
					</div>

					<input
						id="substrLength"
						type="number"
						min="1"
						v-model="substrLength"
						class="input input-bordered input-primary w-full max-w-xs"
						placeholder="3"
					/>

					<div class="label">
						<span class="label-text-alt">Length of the prefix</span>
					</div>
				</label>
			</div>
		</div>
		<div class="flex gap-4">
			<button @click="benchmark" class="btn btn-primary" :disabled="loading">
				<span v-if="loading" className="loading loading-spinner" />
				Benchmark
			</button>
			<button @click="clear" class="btn btn-ghost">Clear</button>
		</div>

		<!-- Results -->
		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr class="">
						<th>Mode</th>
						<th>Average Time (ms)</th>
						<th>Average Comparisons</th>
						<th>Median Time (ms)</th>
						<th>Median Comparisons</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="result in results" :key="result.mode" class="hover">
						<td>{{ result.mode }}</td>
						<td>{{ result.avgTime }}</td>
						<td>{{ result.avgComparisons }}</td>
						<td>{{ result.medianTime }}</td>
						<td>{{ result.medianComparisons }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import { ref } from "vue";

export default {
	name: "Benchmark",
	props: {
		dict: Object,
		trie: Object,
		ternary: Object,
	},
	setup(props) {
		const loading = ref(false);

		const total = ref(1000);
		const limit = ref(10);
		const substrLength = ref(3);

		const results = ref([
			{ mode: "Trie", avgTime: 0, avgComparisons: 0, medianTime: 0, medianComparisons: 0 },
			{ mode: "Ternary", avgTime: 0, avgComparisons: 0, medianTime: 0, medianComparisons: 0 },
		]);

		const parse = (value, defaultValue) => {
			const parsed = parseInt(value, 10);
			return isNaN(parsed) ? defaultValue : parsed;
		};

		const test = (mode = "trie") => {
			const words = props.dict.items;

			const ptotal = parse(total.value, 1000);
			const plength = parse(substrLength.value, 3);
			const plimit = parse(limit.value, 10);

			let comparisons = [];
			let time = [];

			let avgTime = 0;
			let avgComparisons = 0;
			let medianTime = 0;
			let medianComparisons = 0;

			for (let i = 0; i < ptotal; i++) {
				const word = words[Math.floor(Math.random() * words.length)].substring(0, plength);

				const startTime = performance.now();
				const res = mode === "trie" ? props.trie.search(word, plimit) : props.ternary.search(word, plimit);
				const endTime = performance.now();

				time.push(endTime - startTime);
				comparisons.push(res.comparisons);
			}

			avgTime = time.reduce((a, b) => a + b, 0) / ptotal;
			avgComparisons = comparisons.reduce((a, b) => a + b, 0) / ptotal;

			medianTime = time.sort((a, b) => a - b)[Math.floor(ptotal / 2)];
			medianComparisons = comparisons.sort((a, b) => a - b)[Math.floor(ptotal / 2)];

			return { avgTime, avgComparisons, medianTime, medianComparisons };
		};

		const clear = () => {
			results.value = [
				{ mode: "Trie", avgTime: 0, avgComparisons: 0, medianTime: 0, medianComparisons: 0 },
				{ mode: "Ternary", avgTime: 0, avgComparisons: 0, medianTime: 0, medianComparisons: 0 },
			];
		};

		const benchmark = async () => {
			loading.value = true;

			clear();

			const trieResults = test("trie");

			results.value = [
				{
					mode: "Trie",
					...trieResults,
				},
				{
					mode: "Ternary",
					avgTime: 0,
					avgComparisons: 0,
					medianTime: 0,
					medianComparisons: 0,
				},
			];

			await new Promise((resolve) => setTimeout(resolve, 1000));

			const ternaryResults = test("ternary");

			results.value = [
				{
					mode: "Trie",
					...trieResults,
				},
				{
					mode: "Ternary",
					...ternaryResults,
				},
			];

			loading.value = false;
		};

		return { total, limit, substrLength, benchmark, results, loading, clear };
	},
};
</script>
