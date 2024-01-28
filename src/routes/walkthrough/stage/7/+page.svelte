<script lang="ts">
  import { goto } from '$app/navigation';
  import ClassDiagram from '$lib/ClassDiagram.svelte';
  import SparqlIde from '$lib/SparqlIde.svelte';
  import Stages from "$lib/Stages.svelte";

  const solution1 = `select ?person ?name ?transcript where {
  ?person a sdo:Person ; sdo:name ?name ; <income> ?taxIncome; <driversLicense> ?driversLicense .
  ?interview a sdo:Report; <person> ?person; sdo:text ?transcript .
  filter(?person = <person:14887> || ?person = <person:16371>)
}`
  const validator = (results: Record<string, Binding>) => {
    for (const key of Object.keys(results)) {
      if (results[key].value === 'person:16371' || results[key].value === 'person:14887') return true
      if (results[key].value === 'Morty Schapiro' || results[key].value === 'Annabel Miller') return true
    }
    return false
  }
</script>

<Stages stage={7} />
<h2>Making connections</h2>
<h3>Combining data between classes</h3>
<p>
  Until now, we’ve been asking questions that can be answered by considering
  data from only a single class. But what if we need to ask more complex questions
  that simultaneously require data from two different classes? With SPARQL just find commonf 
  information and use that to lin statements together.
</p>

<p>One of the more common ways to link data with SPARQL is to use the <code>object</code> from 
  one statement as <code>subject</code> for another.
</p>

<figure>
  <blockquote class="blockquote">
    <p>Run this query to identify the biggest annual earners in our knowledge graph.</p>
  </blockquote>
  <figcaption class="blockquote-footer">
    Try editing the query to return more data, or to find people with different incomes. 
    Try using other linking, you can always look at the <ClassDiagram /> for reference.
  </figcaption>
</figure>
<SparqlIde>
select ?name ?taxID ?annualIncome where {'{'}
  ?person a sdo:Person ; sdo:name ?name ; &lt;income&gt; ?income .
  ?income a sdo:MonetaryAmount; sdo:value ?annualIncome; sdo:taxID ?taxID .
  filter(?annualIncome &gt; 450000)
{'}'}
order by desc(?annualIncome) limit 10
</SparqlIde>

<p>Sometimes you want to connect more than one class. 
  SPARQL lets you use as many links as you like.</p>
<figure>
  <blockquote class="blockquote">
    <p>Let's see if big earners have other characteristics in common.</p>
  </blockquote>
  <figcaption class="blockquote-footer">
    This example builds on the previous one, but now we link to
    drivers license and registered driver information.
  </figcaption>
</figure>
<SparqlIde>
select ?name ?income ?gender ?eyes ?hair where {'{'}
  ?person a sdo:Person ; sdo:name ?name ; &lt;income&gt; ?taxIncome; &lt;driversLicense&gt; ?driversLicense .
  ?taxIncome a sdo:MonetaryAmount; sdo:value ?income .
  ?driversLicense a sdo:Permit; &lt;driver&gt; ?driver .
  ?driver sdo:gender ?gender; &lt;eyeColor&gt; ?eyes; &lt;hairColor&gt; ?hair .
  filter(?income &gt; 450000)
{'}'}
order by desc(?income) limit 10
</SparqlIde>
<p>Now that you know how to search linked data, 
  you should be able to find the interview transcripts for the <a href={'#find-suspect-1'} on:click={() => goto('/walkthrough/stage/6')}>two witnesses you identified before</a>. 
  Give it a try!
</p>
<figure>
  <blockquote class="blockquote">
    <p>Write a query that shows the interview transcripts for our two subjects.</p>
  </blockquote>
  <figcaption class="blockquote-footer">
    There's more than one way to do it, so you may learn the answer even if the results say 'Incorrect'. 
    The official solution does it in one query, but you don't have to. 
    Technically you don't even need to use linking to get the transcripts, but give it a try.
  </figcaption>
</figure>
<SparqlIde lines={9} solution={solution1} validator={validator} columnStyles={['', 'white-space: nowrap;', '']}>
</SparqlIde>

<p>Now you know enough SPARQL to solve the mystery. 
  You'll need to read the <ClassDiagram /> and make some reasonable assumptions, 
  but there's no other syntax that you need!</p>
<p class="fs-4"><a href="/walkthrough/stahes/8">Go get them!</a></p>