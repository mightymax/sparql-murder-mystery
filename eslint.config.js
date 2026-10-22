import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
  { ignores: ['node_modules/**', '.svelte-kit/**', 'build/**', 'static/**', 'data/**'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'no-undef': 'off',
      'svelte/require-each-key': 'off',
      'svelte/no-navigation-without-resolve': ['error', { ignoreLinks: true }]
    }
  },
  {
    files: ['src/lib/SparqlIde.svelte'],
    // Yasqe owns and renders the editor DOM and its formatted result cells.
    rules: { 'svelte/no-dom-manipulating': 'off', 'svelte/no-at-html-tags': 'off' }
  },
  {
    files: ['**/*.svelte'],
    languageOptions: { parserOptions: { parser: ts.parser } }
  }
);
