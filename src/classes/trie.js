/**
 * Represents a node in a Trie (prefix tree).
 */
class TrieNode {
	/**
	 * Creates an instance of TrieNode.
	 */
	constructor() {
		this.children = {};
		this.isEndOfWord = false;
	}

	/**
	 * Adds a word to the Trie.
	 * @param {string} word - The word to be added.
	 */
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

	/**
	 * Removes a word from the Trie.
	 * @param {string} word - The word to be removed.
	 */
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

/**
 * Class representing a Trie data structure.
 */
export class Trie {
	/**
	 * Create a Trie.
	 * @param {import('./dictionary').Dictionary} dictionary - The dictionary object containing a list of words.
	 */
	constructor(dictionary) {
		this.root = new TrieNode();
		this.dictionary = dictionary;

		for (const word of dictionary.list) {
			this.add(word);
		}
	}

	/**
	 * Add a word to the Trie.
	 * @param {string} word - The word to add.
	 */
	add(word) {
		this.root.add(word);
	}

	/**
	 * Remove a word from the Trie.
	 * @param {string} word - The word to remove.
	 */
	remove(word) {
		this.root.remove(word);
	}

	/**
	 * Check if the Trie contains a word.
	 * @param {string} word - The word to check.
	 * @returns {boolean} True if the word is in the Trie, false otherwise.
	 */
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

	/**
	 * Search for words in the Trie that start with a given prefix.
	 * @param {string} prefix - The prefix to search for.
	 * @param {number} [limit=10] - The maximum number of words to return.
	 * @returns {Object} An object containing the list of words and the number of comparisons made.
	 */
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

	/**
	 * Recursively find words in the Trie starting from a given node.
	 * @param {TrieNode} node - The current Trie node.
	 * @param {string} prefix - The current prefix.
	 * @param {string[]} words - The list of words found.
	 * @param {number} limit - The maximum number of words to return.
	 * @returns {number} The number of comparisons made.
	 * @private
	 */
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

	/**
	 * Get the number of words in the Trie.
	 * @returns {number} The number of words in the Trie.
	 */
	get length() {
		return this.dictionary.length;
	}

	/**
	 * Check if the Trie is empty.
	 * @returns {boolean} True if the Trie is empty, false otherwise.
	 */
	get isEmpty() {
		return this.dictionary.isEmpty;
	}
}
