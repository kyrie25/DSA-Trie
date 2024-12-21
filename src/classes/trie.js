class TrieNode {
	constructor() {
		this.children = {};
		this.isEndOfWord = false;
	}

	add(word) {
		if (word.length === 0) {
			this.isEndOfWord = true;
			return;
		}

		const firstChar = word[0];
		if (!this.children[firstChar]) {
			this.children[firstChar] = new TrieNode();
		}

		this.children[firstChar].add(word.substring(1));
	}

	remove(word) {
		if (word.length === 0) {
			this.isEndOfWord = false;
			return;
		}

		const firstChar = word[0];
		if (this.children[firstChar]) {
			this.children[firstChar].remove(word.substring(1));
		}
	}
}

export class Trie {
	constructor(dictionary) {
		this.root = new TrieNode();
		this.dictionary = dictionary;

		for (const word of dictionary.list) {
			this.add(word);
		}
	}

	add(word) {
		this.root.add(word);
	}

	remove(word) {
		this.root.remove(word);
	}

	contains(word) {
		let current = this.root;

		for (const char of word) {
			if (!current.children[char]) {
				return false;
			}
			current = current.children[char];
		}

		return current.isEndOfWord;
	}

	search(prefix, limit = 10) {
		let current = this.root;
		let comparisons = 0;

		for (const char of prefix) {
			if (++comparisons && !current.children[char]) {
				return { words: [], comparisons };
			}
			current = current.children[char];
		}

		const words = [];
		comparisons += this._findWords(current, prefix, words, limit);
		return { words, comparisons };
	}

	_findWords(node, prefix, words, limit) {
		let comparisons = 0;

		if (++comparisons && words.length >= limit) {
			return comparisons;
		}

		if (node.isEndOfWord) {
			words.push(prefix);
		}

		for (const [char, child] of Object.entries(node.children)) {
			comparisons += this._findWords(child, prefix + char, words, limit);
			if (++comparisons && words.length >= limit) {
				return comparisons;
			}
		}

		return comparisons;
	}

	get length() {
		return this.dictionary.length;
	}

	get isEmpty() {
		return this.dictionary.isEmpty;
	}
}
