export class Dictionary {
	constructor(text) {
		/**
		 * @type {string[]}
		 */
		this.items = text.replaceAll("\r", "").split("\n").sort();
	}

	contains(value) {
		return this.items.includes(value);
	}

	add(word) {
		// Add the word to the dictionary to its correct position
		const index = this.items.findIndex((item) => item > word);
		if (index === -1) {
			this.items.push(word);
		} else {
			this.items.splice(index, 0, word);
		}
	}

	remove(word) {
		const index = this.items.indexOf(word);
		if (index > -1) {
			this.items.splice(index, 1);
		}
	}

	get length() {
		return this.items.length;
	}

	get isEmpty() {
		return this.items.length === 0;
	}

	get list() {
		return this.items;
	}
}
