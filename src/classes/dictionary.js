export class Dictionary {
	constructor(text) {
		/**
		 * @type {string[]}
		 */
		this.items = text.replaceAll("\r", "").split("\n");
	}

	contains(value) {
		return this.items.includes(value);
	}

	add(word) {
		this.items.push(word);
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
