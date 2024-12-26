class TrieNode {
	constructor() {
		this.children = {};
		// Avoid garbage collector by precalculating children array
		this.childrenList = [];
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
			this.childrenList.push(firstChar);
		}

		this.children[firstChar].add(word.substring(1));
	}

	remove(word) {
		if (word.length === 0) {
			this.isEndOfWord = false;
			return Object.keys(this.children).length === 0; // Cleanup if no children
		}

		const firstChar = word[0];
		if (this.children[firstChar]) {
			const shouldDeleteChild = this.children[firstChar].remove(word.substring(1));
			if (shouldDeleteChild) {
				delete this.children[firstChar];
				this.childrenList = this.childrenList.filter(c => c !== firstChar);
			}
		}

		return !this.isEndOfWord && Object.keys(this.children).length === 0; // Cleanup if this node is no longer needed
	}
}

export class Trie {
	constructor(dictionary) {
		this.root = new TrieNode();
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
		prefix = prefix.toLowerCase();

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

		if (node.isEndOfWord) {
			words.push(prefix);
			if (++comparisons && words.length >= limit) return comparisons;
		}

		for (let i = 0; ++comparisons && i < node.childrenList.length; i++) {
			if (++comparisons && words.length >= limit) break;
			comparisons += this._findWords(node.children[node.childrenList[i]], prefix + node.childrenList[i], words, limit);
		}

		return comparisons;
	}

	_height(node) {
		if (node === null) {
			return -1;
		}

		let height = -1;
		for (const child of Object.values(node.children)) {
			height = Math.max(height, this._height(child));
		}

		return height + 1;
	}

	get height() {
		return this._height(this.root);
	}

	get nodes() {
		const queue = [this.root];
		let count = 0;

		while (queue.length > 0) {
			const node = queue.shift();
			count++;

			for (const child of Object.values(node.children)) {
				queue.push(child);
			}
		}

		return count;
	}
}
