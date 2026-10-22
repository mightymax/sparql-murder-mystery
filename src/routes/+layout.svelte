<script lang="ts">
  import Header from '../lib/Header.svelte'
  import Prompt from '#lib/Prompt.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>
<Header/>
<main>
	<div class="container">
		{@render children?.()}
	</div>
	<Prompt id="newspaper_modal">
		<img src="/images/newspaper.svg" id="newspaper" alt="Newspaper of SPARQL City"/>
	</Prompt>
</main>
<style>
	main {
		margin-top: 250px;
		margin-bottom: 50px;
	}
  #newspaper {
    width: 85px;
    position: fixed;
    top: 10px;
    right: 20px;
    z-index: 10000;
  }
</style>
