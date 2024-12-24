# Word Finder

Simple word suggestion program that uses Trie and Ternary Search Tree to find words based on a given prefix.

Written in [Vue.js](https://vuejs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), and [DaisyUI](https://daisyui.com/).

A live demo can be found [here](https://word-finder.kyrie25.dev/).

## Features

- Look up words based on a given prefix
- Add new words to dictionary
- Remove words from dictionary
- Set the maximum number of suggestions to display
- Benchmark the time taken and number of comparisons made to find a word

## Installation

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (preferably v20.13.1 or later)

### Steps

1. Clone the repository

   ```bash
   git clone https://github.com/kyrie25/DSA-Trie.git
   cd DSA-Trie

   # Pull the English dictionary submodule
   git submodule update --init --recursive
   ```

2. Install dependencies

   ```bash
   # Enable Corepack if you haven't already
   corepack enable

   # Install dependencies
   yarn
   ```

3. Run the development server

   ```bash
   yarn dev
   ```
