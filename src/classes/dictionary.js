export class Dictionary {
	constructor(text) {
		/**
		 * @type {string[]}
		 */
		this.items = text.split("\n");
	}

	contains(word) {
		return this.items.some((item) => {
			if (item.toLowerCase() === word.toLowerCase()) console.log(item);
			return item.toLowerCase() === word.toLowerCase();
		});
	}

	add(word) {
		// Add the word to the dictionary to its correct position
		const index = this.items.findIndex((item) => item.toLowerCase() > word.toLowerCase());
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
