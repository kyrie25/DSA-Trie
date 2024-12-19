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
		for (const char of prefix) {
			if (!current.children[char]) {
				return [];
			}
			current = current.children[char];
		}

		const words = [];
		this._findWords(current, prefix, words, limit);
		return words;
	}

	_findWords(node, prefix, words, limit) {
		if (words.length >= limit) {
			return;
		}

		if (node.isEndOfWord) {
			words.push(prefix);
		}

		for (const [char, child] of Object.entries(node.children)) {
			this._findWords(child, prefix + char, words, limit);
			if (words.length >= limit) {
				return;
			}
		}
	}

	get length() {
		return this.dictionary.length;
	}

	get isEmpty() {
		return this.dictionary.isEmpty;
	}
}
