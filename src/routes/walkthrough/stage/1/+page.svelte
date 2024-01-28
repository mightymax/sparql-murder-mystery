<script>
  import Hint from '$lib/Hint.svelte';
  import Intro from '$lib/Intro.svelte';
  import Stages from '$lib/Stages.svelte';
</script>
<Stages stage={1}/>
<Intro mode="walkthrough" />
<p>
  All the clues to this mystery are buried in a huge Knowledge Graph, and you
  need to use SPARQL to navigate through this vast network of information. Your
  first step to solving the mystery is to retrieve the corresponding crime scene
  report from the police department's database. Below we'll explain from a high
  level the queries you need to know; whenever you are ready, you can start
  adapting the examples to create your own SPARQL queries in search of clues --
  you can run any SPARQL query in any of the code boxes, no matter what was in
  the box when you started.
</p>
<Hint>
  Make sure you study and remember the clues in this introduction, paying good attention to the important hints 
  marked with a fingerprint. You can always look at the clues by clicking the newspaper in the header.
</Hint>
