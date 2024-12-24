class TernaryTreeNode {
	constructor(character) {
		this.character = character;
		this.isEndOfWord = false;
		this.left = null;
		this.middle = null;
		this.right = null;
	}
}

export class TernarySearchTree {
	constructor(dictionary) {
		this.root = null;

		for (const word of dictionary.items) {
			this.add(word);
		}
	}

	add(word) {
		this.root = this._insert(this.root, word, 0);
	}

	_insert(node, word, index) {
		const char = word[index];

		if (node === null) {
			node = new TernaryTreeNode(char);
		}

		if (char < node.character) {
			node.left = this._insert(node.left, word, index);
		} else if (char > node.character) {
			node.right = this._insert(node.right, word, index);
		} else {
			if (index + 1 < word.length) {
				node.middle = this._insert(node.middle, word, index + 1);
			} else {
				node.isEndOfWord = true;
			}
		}

		return node;
	}

	remove(word) {
		this.root = this._delete(this.root, word, 0);
	}

	_delete(node, word, index) {
		if (node === null) {
			return null;
		}

		const char = word[index];

		if (char < node.character) {
			node.left = this._delete(node.left, word, index);
		} else if (char > node.character) {
			node.right = this._delete(node.right, word, index);
		} else {
			if (index + 1 < word.length) {
				node.middle = this._delete(node.middle, word, index + 1);
			} else {
				node.isEndOfWord = false;
			}
		}

		if (node.left === null && node.middle === null && node.right === null) {
			return null;
		}

		return node;
	}

	search(word, limit) {
		const words = [];
		const comparisons = this._search(this.root, word, 0, words, limit);
		return { words, comparisons };
	}

	_search(node, word, index, results, limit) {
		let comparisons = 0;

		if (++comparisons && (node === null || results.length >= limit)) {
			return comparisons;
		}

		const char = word[index];

		if (++comparisons && char < node.character) {
			comparisons += this._search(node.left, word, index, results, limit);
		} else if (++comparisons && char > node.character) {
			comparisons += this._search(node.right, word, index, results, limit);
		} else {
			if (++comparisons && index + 1 === word.length) {
				if (node.isEndOfWord) {
					results.push(word);
				}
				comparisons += this._collect(node.middle, word, results, limit);
			} else {
				comparisons += this._search(node.middle, word, index + 1, results, limit);
			}
		}

		return comparisons;
	}

	_collect(node, prefix, results, limit) {
		let comparisons = 0;
		if (++comparisons && (node === null || results.length >= limit)) {
			return comparisons;
		}

		if (++comparisons && node.isEndOfWord && results.length < limit) {
			results.push(prefix + node.character);
		}

		comparisons += this._collect(node.left, prefix, results, limit);
		comparisons += this._collect(node.middle, prefix + node.character, results, limit);
		comparisons += this._collect(node.right, prefix, results, limit);

		return comparisons;
	}

	_height(node) {
		if (node === null) {
			return -1;
		}

		return 1 + Math.max(this._height(node.left), this._height(node.middle), this._height(node.right));
	}

	_countNodes(node) {
		if (node === null) {
			return 0;
		}

		return 1 + this._countNodes(node.left) + this._countNodes(node.middle) + this._countNodes(node.right);
	}

	get height() {
		return this._height(this.root);
	}

	get nodes() {
		return this._countNodes(this.root);
	}
}
