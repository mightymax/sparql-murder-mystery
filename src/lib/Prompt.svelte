<script lang="ts">
  export let id: string = 'prompt'
</script>
<a href="{'#'}" data-bs-toggle="modal" data-bs-target="#{id}">
  <slot>prompt</slot>
</a>
<div id="{id}" class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">There's been a Murder in SPARQL City!</h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p class="fs-5">
          A crime has taken place and the detective needs your help.
          The detective gave you the crime scene report, but you somehow lost it. 
          You vaguely remember that the crime was a <em>murder</em> that occurred sometime 
          on <em>Jan.15, 2018</em> and that it took place in <em>SPARQL City</em>. 
        </p>
      </div>
    </div>
  </div>
</div>
<style>
  em {
    padding-left: 20px;
    background-image: url('/images/fingerprint.svg');
    background-repeat: no-repeat;
    background-position: left center;
    background-size: 15px;
    border-bottom: solid #353f5c 1px;
    font-style: normal;
  }
  em:hover {
    cursor: zoom-in;
  }
</style>