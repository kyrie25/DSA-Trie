export class LinearSearch {
	constructor(dictionary) {
		this.array = dictionary.list;
	}

	add(value) {
		// Does nothing
	}

	remove(value) {
		// Does nothing
	}

	contains(value) {
		for (const item of this.array) {
			if (item === value) {
				return true;
			}
		}

		return false;
	}

	search(value, limit = 10) {
		const result = [];
		let comparisons = 0;
		for (const item of this.array) {
			if (++comparisons && result.length >= limit) {
				break;
			}

			if (++comparisons && item.startsWith(value)) {
				result.push(item);
			}
		}

		return { words: result, comparisons };
	}

	get length() {
		return this.array.length;
	}

	get isEmpty() {
		return this.array.length === 0;
	}

	get list() {
		return this.array;
	}
}
