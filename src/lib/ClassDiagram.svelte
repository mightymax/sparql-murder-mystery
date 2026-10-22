<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

</script>
<a href="#classDiagram" data-bs-toggle="modal" data-bs-target="#classDiagram">
  {#if children}{@render children()}{:else}Class Diagram{/if}
</a>
<div id="classDiagram" class="modal " tabindex="-1">
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Class diagram</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>The relations in our Knowledge Graph can be illustrated in this Class diagram (remember that <code>base &lt;mystery:&gt;</code> is implied):</p>
        <p><img src="/images/ClassDiagram.svg" alt="Class Diagram" /></p>
      </div>
    </div>
  </div>
</div>
