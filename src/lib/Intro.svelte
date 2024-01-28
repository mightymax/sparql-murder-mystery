<script lang="ts">
  export let mode: undefined | string = undefined
</script>
<h1>There's been a Murder in SPARQL City!</h1>
{#if mode !== undefined}
<p class="fs-6">
  {#if mode === 'walkthrough'}
  If you are a experienced SPARQL sleuth, you can <a href="/advanced">skip these explanations</a> and put your skills to the test! 
  {:else if mode === 'experienced'}
  Are you a new SPARQL sleuth? You might want to try <a href="/walkthrough">our walkthrough gameplay</a> to solve the mystery using SPARQL.
  {/if}
</p>
{/if}
<p class="fs-4">
  A crime has taken place and the detective needs your help.
  The detective gave you the crime scene report, but you somehow lost it. 
  You vaguely remember that the crime was a <em>murder</em> that occurred sometime 
  on <em>Jan.15, 2018</em> and that it took place in <em>SPARQL City</em>. 
</p>
<style>
  em {
    padding-left: 20px;
    background-image: url('/images/fingerprint.svg');
    background-repeat: no-repeat;
    background-position: left center;
    background-size: 15px;
    font-weight: bold;
    /* border-bottom: solid #353f5c 1px; */
    font-style: normal;
  }
  em:hover {
    cursor: zoom-in;
  }
</style>