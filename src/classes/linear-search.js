/**
 * Class representing a linear search.
 */
export class LinearSearch {
	/**
	 * Create a linear search instance.
	 * @param {Object} dictionary - The dictionary object containing a list.
	 */
	constructor(dictionary) {
		this.array = dictionary.list;
	}

	/**
	 * Add a value to the search array.
	 * Filler method.
	 * @param {*} value - The value to add.
	 */
	add(value) {
		// Does nothing
	}

	/**
	 * Remove a value from the search array.
	 * Filler method.
	 * @param {*} value - The value to remove.
	 */
	remove(value) {
		// Does nothing
	}

	/**
	 * Check if the array contains a value.
	 * @param {*} value - The value to check.
	 * @returns {boolean} True if the value is found, false otherwise.
	 */
	contains(value) {
		for (const item of this.array) {
			if (item === value) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Search for values that start with the given value.
	 * @param {string} value - The value to search for.
	 * @param {number} [limit=10] - The maximum number of results to return.
	 * @returns {Object} An object containing the search results and the number of comparisons made.
	 */
	search(value, limit = 10) {
		value = value.toLowerCase();

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

	/**
	 * Get the length of the array.
	 * @returns {number} The length of the array.
	 */
	get length() {
		return this.array.length;
	}

	/**
	 * Check if the array is empty.
	 * @returns {boolean} True if the array is empty, false otherwise.
	 */
	get isEmpty() {
		return this.array.length === 0;
	}

	/**
	 * Get the list of values in the array.
	 * @returns {Array} The list of values.
	 */
	get list() {
		return this.array;
	}
}
