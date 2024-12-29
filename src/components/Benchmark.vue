<template>
	<div class="container flex flex-col justify-center items-center text-center gap-4">
		<!-- Config -->
		<div class="flex flex-row max-sm:flex-col justify-center items-center gap-4 max-sm:gap-2 w-full">
			<div class="flex flex-col justify-center items-center gap-4 max-sm:w-fit">
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

			<div class="flex flex-col justify-center items-center gap-4 max-sm:w-fit">
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

			<div class="flex flex-col justify-center items-center gap-4 max-sm:w-fit">
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
			<table class="table table-zebra w-full">
				<thead>
					<tr>
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

		<!-- Log -->
		<div class="mockup-code w-full overflow-x-auto">
			<pre
				v-if="sanitizedLog.length > 1"
				v-for="line in sanitizedLog"
				:key="line"
				:data-prefix="line.trim() ? '>' : ''"
				:class="{
					'text-left': true,
					'text-info': !line.includes(':'),
					'bg-success text-success-content': line.includes('completed'),
				}"
				>{{ line }}</pre
			>
			<pre v-else class="text-left text-warning" data-prefix=">">No logs available</pre>
		</div>
	</div>
</template>

<script>
import { computed, ref } from "vue";

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

		const log = ref("");

		const sanitizedLog = computed(() => log.value.trim().split("\n"));

		const results = ref([
			{ mode: "Trie", avgTime: 0, avgComparisons: 0, medianTime: 0, medianComparisons: 0, callback: props.trie.search.bind(props.trie) },
			{
				mode: "Ternary Search Tree",
				avgTime: 0,
				avgComparisons: 0,
				medianTime: 0,
				medianComparisons: 0,
				callback: props.ternary.search.bind(props.ternary),
			},
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

			if (Array.prototype.toSorted) {
				mode.medianTime = time.toSorted((a, b) => a - b)[Math.floor(ptotal / 2)];
				mode.medianComparisons = comparisons.toSorted((a, b) => a - b)[Math.floor(ptotal / 2)];
			} else {
				mode.medianTime = [...time].sort((a, b) => a - b)[Math.floor(ptotal / 2)];
				mode.medianComparisons = [...comparisons].sort((a, b) => a - b)[Math.floor(ptotal / 2)];
			}

			log.value += `${mode.mode}\n`;
			log.value += `Limit: ${plimit}\n`;
			log.value += `Total: ${ptotal}\n`;
			log.value += `Time: ${JSON.stringify(time)}\n`;
			log.value += `Comparisons: ${JSON.stringify(comparisons)}\n`;
			log.value += `Total time taken: ${time.reduce((a, b) => a + b, 0)}ms\n\n`;

			console.log(mode.mode, plimit, ptotal, time, comparisons);
		};

		const clear = () => {
			results.value.forEach((result) => {
				result.avgTime = 0;
				result.avgComparisons = 0;
				result.medianTime = 0;
				result.medianComparisons = 0;
				return result;
			});

			log.value = "";
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

			log.value += "Benchmark completed, result logged to browser console\n";

			running.value = false;
		};

		return { total, limit, substrLength, benchmark, results, sanitizedLog, running, clear };
	},
};
</script>
