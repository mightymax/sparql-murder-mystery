// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			// Consult https://kit.svelte.dev/docs/integrations#preprocessors
			// for more information about preprocessors
			preprocess: vitePreprocess(),

			// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
			// If your environment is not supported or you settled on a specific environment, switch out the adapter.
			// See https://kit.svelte.dev/docs/adapters for more information about adapters.
			adapter: adapter(),
            paths: { origin: process.env.ORIGIN },

			// this is not safe, but what to do ...
			// @see https://svelte.dev/docs/kit/configuration#csrf
			csrf: {
				// Preserve the existing cross-origin SPARQL form behavior.
				trustedOrigins: ['*']
			}
		})
	]
});
