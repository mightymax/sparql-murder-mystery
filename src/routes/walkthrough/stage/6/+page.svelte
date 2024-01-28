<script lang="ts">
  import Hint from '$lib/Hint.svelte';
import SparqlIde from "$lib/SparqlIde.svelte";
  import Stages from "$lib/Stages.svelte";

  const solution1 = `select * 
where { ?person a sdo:Person ; 
  <age> ?age;  <eyeColor> ?eyeColor ; 
  <hairColor> ?hairColor ; sdo:height ?height;
} 
order by asc(?height) desc (?age) asc(?eyeColor)
limit 10`

  const solution2 = `select * where {
  ?person a sdo:Person ; sdo:name ?name ; sdo:streetAddress ?streetAddress ;
  <streetName> ?street ; <houseNumber> ?houseNumber .
  filter(?street = 'Northwestern Dr')
}
order by desc(?houseNumber) limit 1`

  const solution3 = `select * where {
  ?person a sdo:Person ; sdo:name ?name ; sdo:streetAddress ?streetAddress ;
  <streetName> ?street ; <houseNumber> ?houseNumber .
  filter (contains(?name, 'Annabel'))
  filter (?street = 'Franklin Ave')
}
order by desc(?houseNumber) limit 1`

  const validate = (id: number) => {
    return (results: Record<string, Binding>) => {
      for (const key of Object.keys(results)) {
        if (results[key].value === `person:${id}`) return true
      }
      return false
    }
  }
</script>

<Stages stage={6} />
<h2>Digging deeper</h2>
<h3>SQL Aggregate Functions</h3>
<p>
  Sometimes the questions you want to ask aren’t as simple as finding the
  statement in the Knowledge Graph that fits a set of criteria. You may want to
  ask more complex questions such as “<em>Who is the oldest person?</em>” or “<em
    >Who is the shortest person?</em
  >”. Aggregate functions can help you answer these questions. In fact, you
  learned an aggregate function earlier: <code>count</code>.
</p>

<p>
  How old is the oldest person with a drivers license? With a small amount of
  data, you might be able to just eyeball it, but there hundreds of thousands of
  statement in the Knowledge Graph. (try <code
    >select (count(*) as ?count) where {"{"} ?s ?p ?o {"}"}</code
  > if you want to know just how many!) You can't just look over that list to find
  the answer.
</p>

<p>Here are a few useful aggregate functions SQL provides:</p>
<p class="text-secondary">
  For clearity we use the names of functions here in capitals. In SPARQL there
  is no distinction between lower- and uppercase for functions. You can use <code
    >COUNT</code
  >, <code>Count</code> or <code>count</code>, they all are the same function.
</p>
<dl class="row">
  <dt class="col-sm-1"><code>MAX</code></dt>
  <dd class="col-sm-11">finds the maximum value</dd>
  <dt class="col-sm-1"><code>MIN</code></dt>
  <dd class="col-sm-11">finds the minimum value</dd>
  <dt class="col-sm-1"><code>SUM</code></dt>
  <dd class="col-sm-11">calculates the sum of the specified column values</dd>
  <dt class="col-sm-1"><code>AVG</code></dt>
  <dd class="col-sm-11">
    calculates the average of the specified column values
  </dd>
  <dt class="col-sm-1"><code>COUNT</code></dt>
  <dd class="col-sm-11">counts the number of specified column values</dd>
</dl>
<figure>
  <blockquote class="blockquote">
    <p>Run this query, then try some of the other aggregate functions:</p>
  </blockquote>
</figure>
<SparqlIde>
  select (max(?age) as ?MaxAge) where {"{"} ?person a sdo:Person ; &lt;age&gt; ?age {"}"}
</SparqlIde>
<p>
  As you see in this query we use a RDF predicate <code
    >&lt;age&gt;</code
  >. This is one of the elements in our Knowledge Graph that does not use
  Schema.org to express statements (Schema.org does not have an <code>age</code>
  property). In RDF, <code>&lt;age&gt;</code> is a valid Iri ( as long as <code>base</code> is set) and can be
  used as an identifier. As a reminder, in SPARQL we can simply ask all
  properties known to persons (<code>sdo:Person</code>):
</p>
<SparqlIde>
  select distinct ?predicate where {"{"} ?person a sdo:Person ; ?predicate ?object {"}"}
</SparqlIde>
<Hint>
  In some columns you will see values suffixed with <code><sup>^^&lt;xsd:&hellip;&gt;</sup></code>. 
  In RDF, these are called literals, and the suffix is the datatype of that literal. hat will tell us if information is a number, date, etc.
  In most knowledge graphs, the <a href="https://www.tutorialspoint.com/xsd/index.htm" target="_blank">XML Schema Definition</a> commonly known as XSD is used to provide datatypes for literal.
</Hint>
<p>
  There's another way to find minimum and maximum values, while also seeing more
  of the data. You can control the sort order of results you get. It's really
  quite intuitive: just use <code>order by</code> followed by a binding name. It can be
  challenging when there's a lot of data! By default, <code>order by</code> goes in "ascending" (smallest to largest, or A to Z, 0 to 9) order, 
  but you can be specific with <code>asc</code> for ascending, or you can reverse it with <code>desc</code>.
</p>

<figure>
  <blockquote class="blockquote">
    <p>Run this query to see how to control sort order.</p>
  </blockquote>
  <figcaption class="blockquote-footer">
    After you've run it, change
  <code>asc</code> to <code>desc</code>, or take that part out completely to see how the results differ.
  Try sorting on other bindings, click the <button class="btn btn-secondary btn-sm"><i class="bi bi-question-square-fill"></i></button> button
  if you want to see how to sort on multiple bindings.
  </figcaption>
</figure>
<SparqlIde solution={solution1}>
select * 
where {'{'} ?person a sdo:Person ; 
  &lt;age&gt; ?age;  &lt;eyeColor&gt; ?eyeColor ; 
  &lt;hairColor&gt; ?hairColor ; sdo:height ?height;
{'}'} 
order by asc (?age) limit 10
</SparqlIde>
<Hint>
  As you can guess by the identifiers in the results (the column where the binding <code>?person</code> is shown),
  the persons displayed are actual drivers (that is: persons with a drivers license). Later we will learn ways to connect data to other data (e.g. persons to their drivers license)
  one of the key functions of using SPARQL to discover more linked information.
</Hint>

<figure id="find-suspect-1">
  <blockquote class="blockquote">
    <p>Write a query that identifies the first witness.</p>
  </blockquote>
  <figcaption class="blockquote-footer">
    There's more than one way to do it, so you may learn the answer even if the results say 'Incorrect'.
    Make sure to include the ID of the person we are looking for, otherwise we can not check the correct result.
    If you found the correct answer, you will see an indicator <i class="bi bi-check-square-fill fs-4 text-success"></i>
    in the result.
  </figcaption>
</figure>

<SparqlIde lines={11} solution={solution2} validator={validate(14887)}></SparqlIde>

<figure>
  <blockquote class="blockquote">
    <p>Write a query that identifies the second witness.</p>
  </blockquote>
  <figcaption class="blockquote-footer">
    There's more than one way to do it, so you may learn the answer even if the results say 'Incorrect'.
    Make sure to include the ID of the person we are looking for, otherwise we can not check the correct result.
    If you found the correct answer, you will see an indicator  <i class="bi bi-check-square-fill fs-4 text-success"></i>
    in the result.
  </figcaption>
</figure>

<SparqlIde lines={11} solution={solution3} validator={validate(16371)}></SparqlIde>
