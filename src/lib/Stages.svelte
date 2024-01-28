<script lang="ts">
  import { goto } from '$app/navigation';
  export let stage: number = 1
  const sections = [
    'Introduction',
    'Some definitions',
    'What is a SPARQL query?',
    'SPARQL Exercises',
    'Elements of a SPARQL query',
    'Digging deeper',
    'Making connections',
    'Ready to solve the crime?'
  ]
  $: title = sections[stage-1]
  
  $: next = stage === sections.length ? '/walkthrough/stage/1' : `/walkthrough/stage/${stage+1}`
  $: prev = stage === 1 ? `/walkthrough/stage/${sections.length}` : `/walkthrough/stage/${stage-1}`
</script>
<ul class="nav nav-underline bg-body-tertiary mb-3 nav-justified">
  <li class="nav-item">
    <a class="nav-link" href={prev} on:click={() => goto(prev)}><i class="bi bi-arrow-left-square-fill"></i> Previous</a>
  </li>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="{'#'}" role="button" aria-expanded="false">{stage}/{sections.length} | {title}</a>
    <ul class="dropdown-menu">
      {#each sections as section, i}
        <li><a class="dropdown-item" on:click={() => goto(`/walkthrough/stage/${i+1}`)} href=/walkthrough/stage/{i+1}>{section}</a></li>
      {/each}
    </ul>
  </li>
  <li class="nav-item">
    <a class="nav-link" href={next} on:click={() => goto(next)}>Next <i class="bi bi-arrow-right-square-fill"></i></a>
  </li>
</ul>
