<script lang="ts">
  import Stages from '$lib/Stages.svelte';
</script>
<Stages stage={2}/>
<h2>Some definitions</h2>
<h3>What is SPARQL?</h3>
<p>
  SPARQL (pronounced "<em>sparkle</em>"), is a recursive acronym for SPARQL
  Protocol and RDF Query Language, is a query language to interact with linked
  data in a way that allows us humans to glean specific, meaningful
  information.
</p>
<p>
  A SPARQL query is processed by a SPARQL engine. The sourcedata the engine
  uses to fetch results is not important for the person executing the query,
  the SPARQL engine should be standards complient an able to process any valid
  SPARQL query. In this game a SPARQL endpoint is used: an internet service
  that accepts SPARQL queries and answers with the results of that query.
</p>
<h3>Wait, what is Linked Data?</h3>
<p>
  Linked Data is structured data which is interlinked with other data so it
  becomes more useful through SPARQL queries. Linked data (or Linked Open Data
  if the data is open) was introduced by <a
    href="https://en.wikipedia.org/wiki/Tim_Berners-Lee">Tim Berners Lee</a
  >
  when presenting his vision to turn the Internet into a global database.
  Wikipedia has an
  <a href="https://en.wikipedia.org/wiki/Linked_data"
    >article about Linked Data</a
  > which is a good starting point to learn more.
</p>
<p>
  When using SPARQL to query Linked Data it is important to unserstand that
  knowledge can be expressed in so called "<em>triples</em>": three entities (<em
    >Subject</em
  >, <em>Predicate</em> and <em>Object</em>) codify a statement (e.g. "Jane is
  married to John"). The Resource Description Framework (RDF) provides a data
  model using this subject-object-predicate expressions. Linked Data is more
  usefull if it uses URI's as identifiers for things. The previous statement
  about Jane and John being a married couple can be expressed in RDF:
  <br /><code
    >&lt;https://ex.com/jane&gt; &lt;https://schema.org/spouse&gt;
    &lt;https://ex.com/john&gt;</code
  >
</p>
<h3>The semantics of the game</h3>
<p>
  The SPARQL Murder Mystery uses semantics from <a href="https://schema.org">schema.org vocabulary</a> 
  (prefixed as <code>sdo:</code>) as much as possible. 
  If you see an Iri used to identify something, you can lookup what that Iri identifies exactly by simply clicking on the link.
  If no link is proviced, than the identifier is just for the purpose of this game.
</p>
<p>
  Often we use the vocabulary loosly. This is unwise in real-life Knowledge Graphs, but it makes
  the game easier to play. For example, schema.org defines that the object for preciate
  <code>sdo:spatialCoverage</code> should be a <code>sdo:Place</code>, 
  but in our Knowledge Graph we simply use the placename as a literal. 
  Some knowledge requires specific modelling using a custom
  vocabulary available in this dataset prefixed with <code>mystery:</code>.
</p>
<p>If you see Iri's like <code>&lt;mystery:age&gt;</code>, remember that it is a valid Iri and can be used to identifiy something in our Knowledge Graph.
In real life you would probably not use those kinds of Iri's since the do not point to an internet address 
(they can not be resolved).
</p>
<p>To make our queries more readable we use the SPARQL keyword <code>base</code>. When a "base" is defined,
releative Iri's like <code>&lt;age&gt;</code> can still be used: <br><code>&lt;mystery:age&gt;</code> 
is the same Iri as <code>&lt;age&gt;</code> if <code>base &lt;mystery:&gt;</code> is defined.
</p>

<h3>The relations in a Knowledge Graph</h3>
<p>
  If you are used to using relational databases you might know about
  entity-relationship-diagrams (ERD) where you can see the predefined
  relations of things to other things. In a Knowledge Graph, those
  relationships are more implicit and ad-hoc. Relations can be defined in
  Vocabularies or Ontologies, but with SPARQL it is easy to join things using
  identifiers. We will use this to solve the murder case.
</p>
<p>The relations in our Knowledge Graph can be illustrated in this Class diagram (remember that <code>base &lt;mystery:&gt;</code> is implied):</p>
<img id="class-diagram" src="/images/ClassDiagram.svg" alt="Class Diagram" />