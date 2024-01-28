<script lang="ts">
  import SparqlIde from '$lib/SparqlIde.svelte';
import Stages from '$lib/Stages.svelte';
</script>
<Stages stage={3}/>

<h2>What is a SPARQL query?</h2>
<p>
  If you were to look at all the statements in the Knowledge Graph, you would
  see that there are a lot (more than 400.00)! There are so many data points;
  it simply isn't possible to go through the statement one by one to find the
  information we need. What are we supposed to do?
</p>
<p>
  This is where queries come in. Queries are statements we construct to get
  data from the Knowledge Graph. Queries read like natural English (for the
  most part). In the next sections we are going to try a few queries against
  our Knowledge Graph. For each of the boxes in the game, click the <btn class="btn btn-secondary btn-sm"><i class="bi bi-search"></i> search</btn>
  button the execute the query in the box. You can edit the queries right here
  on the page to explore further.
</p>
<h3>What to do about those long URI's?</h3>
<p>
  In the examples above we use URI's to identify Things. In SPARQL we often
  want to use the same IRI but with a different suffix. For readiblity we
  might want to use <em>prefixes</em> in the form of
  <code>example: &lt;iri&gt;</code>. If we define the prefix
  <code>sdo: &lt;https://schema.org/&gt;</code>, we can simplify
  <code>&lt;https://schema.org/spouse&gt;</code>
  to <code>sdo:spouse</code>. In the SPARQL boxes, we hide the prefixes for
  readibility, but feel free to click the expand arrows to see them.
</p>
<p>The game uses the following prefixes:</p>
<ul>
  <li>
    <code>rdf: &lt;http://www.w3.org/1999/02/22-rdf-syntax-ns#&gt;</code> RDF stands
    for Resource Description Framework and is a standard for describing web resources
    and data interchange, developed and standardized with the World Wide Web Consortium
    (W3C).
  </li>
  <li>
    <code>xsd: &lt;http://www.w3.org/2001/XMLSchema#&gt;</code> Datatypes from
    XML Schema to type certain information as a specific type, e.g. a
    <code>xsd:date</code>
    can be used to mark "<em>2018-01-15</em>" as a date.
  </li>
  <li>
    <code>sdo: &lt;https://schema.org/&gt;</code> Schema.org is a collaborative,
    community activity with a mission to create, maintain, and promote schemas
    for structured data on the Internet, on web pages, in email messages, and beyond.
  </li>
</ul>
<h3>Your first SPARQL Query</h3>
<p>In the game we provide input boxes where you can type your SPARQL Query. Below is an example of one of the simpelest possible queries.
  Don't worry if you do not get this query, this is just to get yourself familiair with the SPARQL Query input box.
 Just click the <btn class="btn btn-secondary btn-sm"><i class="bi bi-search"></i> search</btn> button to run the query 
 or the <btn class="btn btn-secondary btn-sm"><i class="bi bi-arrow-counterclockwise"></i> reset</btn> button to go back to the original query.
 In most cases it is wise to use the <code>limit</code> SPARQL keyword to make sure you do not load the entire dataset. 
 This will cause your query to timeout.
</p>
<SparqlIde>select * where {'{'} ?subject ?predicate ?object {'}'} limit 10</SparqlIde>