<script lang="ts">
  import { goto } from '$app/navigation';
  import Prompt from '$lib/Prompt.svelte';
  import SparqlIde from "$lib/SparqlIde.svelte";
  import Stages from "$lib/Stages.svelte";

  const solution = `select ?reportText where {
  ?report a sdo:Report;
    sdo:text ?reportText; 
    sdo:dateCreated "2018-01-15"^^xsd:date ; 
    sdo:additionalType "murder"; 
    sdo:spatialCoverage "SPARQL City" .
}`

  const validator = (response: Record<string, Binding>) => {
    const correct = 'Security footage shows that there were 2 witnesses. The first witness lives at the last house on "Northwestern Dr". The second witness, named Annabel, lives somewhere on "Franklin Ave".'
    for (const key of Object.keys(response)) {
      if (response[key].value === correct) {
        return true
      }
    }
    return false
  }

</script>

<Stages stage={5} />
<h2>Elements of a SPARQL query</h2>
<p>A SPARQL query can contain:</p>
<ul>
  <li>SPARQL keywords (like the select and where above)</li>
  <li>
    Variables that will be bound to values (like <code>?thing</code> and
    <code>?type</code> you have seen before)
  </li>
  <li>
    Subject, Predicate and Object elements in the form of Iri's and/or Literals
    (numbers, strings, dates, etc.)
  </li>
  <li>Wildcard characters (such as <code>%</code>)</li>
  <li>Functions</li>
  <li>Specific filtering criteria</li>
  <li>Etc</li>
</ul>
<p>The <code>select</code> keyword allows us to grab data from specific bindings from our query.</p>
<ul>
  <li><code>*</code> (asterisk) is used to grab all variable bindings from our query</li>
  <li><code>?varname(s)</code> is used to grab specific bindings, put the names of the variables
  after <code>select</code> and use a whitespace to seperate them.</li>
</ul>

<p>
  By combining these elements it is possible to search for specific criteria. Note
  that you need to use quotes (<code>"</code>) around literal text so the SPARQL engine can tell
  it apart from keywords, IRI's, functions and other elements of a SPARQL query. 
</p>

<figure>
  <blockquote class="blockquote">
    <p>Let's try some queries.</p>
  </blockquote>
  <figcaption class="blockquote-footer">
    After you run the query below, try again with <em>Yessenia Fossen</em>, <em>Ted Denfip</em> or <em>Davina Gangwer</em>.
  </figcaption>
</figure>

<SparqlIde>
select * where {'{'}
  ?person a sdo:Person; sdo:name "Kinsey Erickson" .
  ?person ?predicate ?object .
{'}'}
</SparqlIde>
<figure>
  <blockquote class="blockquote">
    <p>You can of course always try to list more names by running this query:</p>
  </blockquote>
</figure>


<SparqlIde>
  select * where {'{'} ?person a sdo:Person; sdo:name ?name {'}'} limit 10
</SparqlIde>

<figure>
  <blockquote class="blockquote">
    <p>With SPARQL it is possible to filter on multiple criteria so that the filtered results meet each and every one of the criteria.</p>
  </blockquote>
  <figcaption class="blockquote-footer">
    This query only returns reports about a specific type of crime in a specific city. 
      Notice that when querying for text values, you must match the data as it is in the Knowledge Graph. 
      Try changing 'Chicago' to 'chicago' and running the statement. 
      Then, see if you can edit this SPARQL query to find the first clue based on the <Prompt/>.
      (hint look for the hints with the fingerprints).
  </figcaption>
</figure>
<SparqlIde solution={solution} validator={validator}>
select ?reportDate ?reportText where {'{'}
  ?report a sdo:Report;
    sdo:dateCreated ?reportDate ; sdo:text ?reportText; 
    sdo:additionalType "theft"; 
    sdo:spatialCoverage "Chicago" .
{'}'}
</SparqlIde>
<p>If you haven't found the right crime scene report yet, click the
  <button class="btn btn-secondary btn-sm"><i class="bi bi-question-square-fill"></i></button> button in the SPARQL editor
to reveal the correct query. 
If you figured out the query that shows the single crime scene report instead of a few for the same city and type, 
then congratulations, you just found the first piece of the puzzle!</p>

<h3 >Wildcards and other functions for partial matches</h3>
<p>Sometimes you only know part of the information you need. SPARQL can handle tha using functions. 
  In this game we only need functions that operate on string values (or "literals"). 
  There are functions that match patterns 
  The most common is the % wildcard.</p>
<p>An example of a function that works on literals is <code>strstarts</code> that returns only values that start with a given inputstring.
For example <code>strstarts(</code>
  the SQL system will return results that match the rest of the string exactly, 
  and have anything (or nothing) where the wildcard is. 
  For example, <code>strstarts(?name, 'Bob')</code> searches for people who's name starts with "Bob".
  A list of functions that work on string literals can be found <a href="https://en.wikibooks.org/wiki/SPARQL/Expressions_and_Functions#Functions_on_strings" target="_blank">here</a>.
  The most versatile string function is `regex(string, pattern, flag)`, it uses <a href="https://en.wikipedia.org/wiki/Regular_expression">regular expressions</a> to search for patterns.
  For example, <code>regex(?place, 'ca%a', 'i')</code> matches <code>Canada</code> and <code>California</code>.
</p>
<p>Now let's try some queries that search for patterns,
   using the examples here and some functions you can find in the link provided.</p>
<SparqlIde>
select distinct ?city where {'{'}
  ?report a sdo:Report; sdo:spatialCoverage ?city .
  filter(strstarts(?city, "I"))
{'}'}
</SparqlIde>

<p>SPARQL also supports numeric comparisons like <code>&lt;</code> (less than) and <code>&gt;</code> (greater than). 
  They work on dates, numbers and words.
Can you guess what the following query is looking for?
</p>

<SparqlIde>
select ?name ?address where {'{'}
  ?person a sdo:Person ; sdo:name ?name ; sdo:streetAddress ?address ;
  &lt;houseNumber&gt; ?houseNumber .
  filter(?houseNumber &gt; 100 &amp;&amp; ?houseNumber &lt; 105)
{'}'}
</SparqlIde>

<p>Sometimes you don't know how the text is stored in the database. 
  SPARQL provides a couple of functions which can smooth that out for you. 
  They're called <code>ucase()</code> and <code>lcase()</code>, and you can probably figure out what they do, 
  especially if you explore in the box below. Make sure to try out <code>ucase()</code> as well.</p>
<SparqlIde>
select distinct ?city where {'{'}
  ?report a sdo:Report; sdo:spatialCoverage ?city .
  filter (lcase(?city) = "sparql city")
{'}'}
</SparqlIde>
