<script lang="ts">
  import Intro from "../../lib/Intro.svelte";
  import SparqlIde from '$lib/SparqlIde.svelte';
  import ClassDiagram from '$lib/ClassDiagram.svelte';
</script>
<Intro mode="experienced" />
<h2>Exploring the Knowledge Graph Structure</h2>
<p>
  Experienced SPARQL users can often use SPARQL queries to infer the structure of a Knowledge
  Graph. But each dataset has different ways of expressing knowledge. The SPARQL Murder
  Mystery uses semantics from <a href="https://schema.org">schema.org vocabulary</a> (prefixed as <code>sdo:</code> as much as possible. Often we use
  the vocabulary loosly. This is unwise in real-life Knowledge Graphs, but it makes
  the game easier to play. For example, schema.org defines that the object for preciate
  <code>sdo:spatialCoverage</code> should be a <code>sdo:Place</code>, 
  but in our Knowledge Graph we simply use
  the placename as a literal. Some knowledge requires specific modelling using a custom
  vocabulary available in this dataset prefixed with <code>mystery:</code>.
</p>
<figure>
  <blockquote class="blockquote">
    <p>Run this query to find the classes used in this Knowledge Graph.</p>
  </blockquote>
  <figcaption class="blockquote-footer">
    You can always look at the <ClassDiagram /> for reference.
  </figcaption>
</figure>
<SparqlIde>
select ?class (count(?class) as ?count) where &lcub;?thing a ?class &rcub; 
group by ?class
order by desc(count(?class))
</SparqlIde>

<p>Besides knowing the class names, you need to know how the data is structured. 
  This might require running multiple queries for specific classes.</p>
<figure>
  <blockquote class="blockquote">
    <p>Run this query to get properties used by statements that are of type <code>sdo:Person</code>.</p>
  </blockquote>
  <figcaption class="blockquote-footer">
    By using the <code>distinct</code> SPARQL keyword we make sure to only get the unique values.
  </figcaption>
</figure>
<SparqlIde>
select distinct ?predicate where {'{'}
  ?subject a sdo:Person; ?predicate ?object .
{'}'}
</SparqlIde>
<figure>
  <blockquote class="blockquote">
    <p>The rest is up to you!</p>
  </blockquote>
  <figcaption class="blockquote-footer">
   If you're really comfortable with SPARQL, you can probably get it from here. 
  But you can always go to the <a href="/walkthrough">walkthrough</a> or have a look at the <ClassDiagram/>.
  </figcaption>
</figure>
<SparqlIde lines={10}>
select * where &lcub;
  ?sub ?pred ?obj
&rcub; limit 10
</SparqlIde>    
