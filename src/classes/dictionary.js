/**
 * Class representing a Dictionary.
 */
export class Dictionary {
	/**
	 * Create a Dictionary.
	 * @param {string} text - The initial text to populate the dictionary.
	 */
	constructor(text) {
		/**
		 * @type {string[]}
		 */
		this.items = text.replaceAll("\r", "").split("\n");
	}

	/**
	 * Check if the dictionary contains a specific word.
	 * @param {string} value - The word to check.
	 * @returns {boolean} True if the word is in the dictionary, false otherwise.
	 */
	contains(value) {
		return this.items.includes(value);
	}

	/**
	 * Add a word to the dictionary.
	 * @param {string} word - The word to add.
	 */
	add(word) {
		this.items.push(word);
	}

	/**
	 * Remove a word from the dictionary.
	 * @param {string} word - The word to remove.
	 */
	remove(word) {
		const index = this.items.indexOf(word);
		if (index > -1) {
			this.items.splice(index, 1);
		}
	}

	/**
	 * Get the number of words in the dictionary.
	 * @returns {number} The number of words in the dictionary.
	 */
	get length() {
		return this.items.length;
	}

	/**
	 * Check if the dictionary is empty.
	 * @returns {boolean} True if the dictionary is empty, false otherwise.
	 */
	get isEmpty() {
		return this.items.length === 0;
	}

	/**
	 * Get the list of words in the dictionary.
	 * @returns {string[]} The list of words in the dictionary.
	 */
	get list() {
		return this.items;
	}
}
