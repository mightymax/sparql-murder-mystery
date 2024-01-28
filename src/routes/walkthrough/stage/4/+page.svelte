<script>
  import SparqlIde from '$lib/SparqlIde.svelte';
  import Stages from '$lib/Stages.svelte';
</script>
<Stages stage={4}/>
<h2>SPARQL Exercises</h2>
<h3>What kinds of Things are in this Knowledge Graph?</h3>
<p>Most <em>Things</em> have a type, in RDF we call this a <em>Class</em>. The predicate of a type is a <code>rdf:type</code>, but we can 
abbreviate this by the word <code>a</code>. To find out which classes are used, try this query:</p>
<SparqlIde>
  select distinct ?class where &lbrace; ?thing a ?class &rbrace;
</SparqlIde>

<h3>Just how many people are in this Knowledge Graph</h3>
<p>In the previous result we saw that there are statement which are of type <code>sdo:Person</code>. Don't worry about exactly what this means, but know that you can change <code>sdo:Person</code> to any other Class you are interested in.
Try it!</p>
<SparqlIde>
  select (count(*) as ?count) where &lbrace; ?thing a sdo:Person &rbrace;
</SparqlIde>
<h3>What do we know about those people?</h3>
<p>If you want all the statements for a person the Knowledge Graph you can query for all the properties for Things that are of Class <code>sdo:Person</code>. 
As you just learned, there are thousands of people, so rather than see all of them, we'll limit the results to just the first one. 
Run this, then change the Class name (e.g. to <code>sdo:Car</code>, make sure to remove the <code>sdo:taxId</code> property, cars do not have them) to see what happens.
</p>
<SparqlIde>
select distinct ?predicate where &lbrace; ?subject a sdo:Person; ?predicate ?object &rbrace; 
</SparqlIde>

<h3>What are possible values for the objects of a statement?</h3>
<p>When working with data, always see if you can find documentation that explains the Knowledge Graph structure and valid values. 
  But sometimes that’s not available. 
  Here we show how the <code>distinct</code> keyword can give you a quick look at which values are in the Knowledge Graph for Crime Scene Reports.
</p>
<SparqlIde>select distinct ?type where {'{'} ?thing a sdo:Report; sdo:additionalType ?type {'}'}</SparqlIde>
