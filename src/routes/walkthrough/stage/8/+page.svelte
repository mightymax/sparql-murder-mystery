<script lang="ts">
  import ClassDiagram from '$lib/ClassDiagram.svelte';
import Hint from '$lib/Hint.svelte';
  import Prompt from '$lib/Prompt.svelte';
  import SparqlIde from '$lib/SparqlIde.svelte';
import Stages from '$lib/Stages.svelte';
</script>
<Stages stage={8}/>
<h2>Ready to solve the crime?</h2>
<p >
  In the previous sections you learned enough skills to solve the crime in SPARQL City.
  Now it is up to you to find the murder!
</p>
<SparqlIde lines={10}>
select * where {'{'} ?subject ?predicate ?object {'}'}
</SparqlIde>
<Hint>
  You can always look at the <ClassDiagram /> or reread the <Prompt/>.
</Hint>