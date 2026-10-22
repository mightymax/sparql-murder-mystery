<script lang="ts">
  interface Props {
    stage?: number;
  }

  let { stage = 1 }: Props = $props();
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
  let title = $derived(sections[stage-1])

  let next = $derived(stage === sections.length ? '/walkthrough/stage/1' : `/walkthrough/stage/${stage+1}`)
  let prev = $derived(stage === 1 ? `/walkthrough/stage/${sections.length}` : `/walkthrough/stage/${stage-1}`)
</script>
<ul class="nav nav-underline bg-body-tertiary mb-3 nav-justified">
  <li class="nav-item">
    <a class="nav-link" href={prev}><i class="bi bi-arrow-left-square-fill"></i> Previous</a>
  </li>
  <li class="nav-item dropdown">
    <button type="button" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">{stage}/{sections.length} | {title}</button>
    <ul class="dropdown-menu">
      {#each sections as section, i}
        <li><a class="dropdown-item" href="/walkthrough/stage/{i+1}">{section}</a></li>
      {/each}
    </ul>
  </li>
  <li class="nav-item">
    <a class="nav-link" href={next}>Next <i class="bi bi-arrow-right-square-fill"></i></a>
  </li>
</ul>
