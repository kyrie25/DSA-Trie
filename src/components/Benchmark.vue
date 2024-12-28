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
			<button @click="benchmark" :class="{ btn: true, 'btn-primary': true, 'cursor-not-allowed': running || loading }">
				<span v-if="running" className="loading loading-spinner" />
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
		loading: Boolean,
		dict: Object,
		trie: Object,
		ternary: Object,
	},
	setup(props) {
		const running = ref(false);

		const total = ref(1000);
		const limit = ref(10);
		const substrLength = ref(3);

		const results = ref([
			{ mode: "Trie", avgTime: 0, avgComparisons: 0, medianTime: 0, medianComparisons: 0, callback: props.trie.search.bind(props.trie) },
			{ mode: "Ternary", avgTime: 0, avgComparisons: 0, medianTime: 0, medianComparisons: 0, callback: props.ternary.search.bind(props.ternary) },
		]);

		const parse = (value, defaultValue) => {
			const parsed = parseInt(value, 10);
			return isNaN(parsed) ? defaultValue : parsed;
		};

		const test = (mode = {}, wordsUsed) => {
			const words = props.dict.items;

			const ptotal = parse(total.value, 1000);
			const plength = parse(substrLength.value, 3);
			const plimit = parse(limit.value, 10);

			let comparisons = [];
			let time = [];

			for (let i = 0; i < ptotal; i++) {
				let word = wordsUsed[i];
				if (!word) {
					word = words[Math.floor(Math.random() * words.length)].substring(0, plength);
					wordsUsed.push(word);
				}

				const startTime = performance.now();
				const res = mode.callback(word, plimit);
				const endTime = performance.now();

				time.push(endTime - startTime);
				comparisons.push(res.comparisons);
			}

			mode.avgTime = time.reduce((a, b) => a + b, 0) / ptotal;
			mode.avgComparisons = comparisons.reduce((a, b) => a + b, 0) / ptotal;

			mode.medianTime = time.sort((a, b) => a - b)[Math.floor(ptotal / 2)];
			mode.medianComparisons = comparisons.sort((a, b) => a - b)[Math.floor(ptotal / 2)];
		};

		const clear = () => {
			results.value.forEach((result) => {
				result.avgTime = 0;
				result.avgComparisons = 0;
				result.medianTime = 0;
				result.medianComparisons = 0;
				return result;
			});
		};

		const benchmark = async () => {
			if (running.value) return;
			running.value = true;

			clear();
			await new Promise((resolve) => setTimeout(resolve, 10));

			const words = [];

			for (const mode in results.value) {
				test(results.value[mode], words);
				await new Promise((resolve) => setTimeout(resolve, 50));
			}

			running.value = false;
		};

		return { total, limit, substrLength, benchmark, results, running, clear };
	},
};
</script>
