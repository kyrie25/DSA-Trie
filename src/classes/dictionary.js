/**
 * Class representing a Dictionary.
 */
export class Dictionary {
	constructor(text) {
		this.items = text.replaceAll("\r", "").split("\n");
		this.shuffle();
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

	shuffle() {
		let currentIndex = this.items.length;

		// While there remain elements to shuffle...
		while (currentIndex != 0) {
			// Pick a remaining element...
			let randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[this.items[currentIndex], this.items[randomIndex]] = [this.items[randomIndex], this.items[currentIndex]];
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
