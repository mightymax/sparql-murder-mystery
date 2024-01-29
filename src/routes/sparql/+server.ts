import { json } from '@sveltejs/kit';
import { SPARQL_ENDPOINT } from '$env/static/private';
import type { Query, SelectQuery } from 'sparqljs'
import pkg from 'sparqljs';
const {Generator, Parser} = pkg;
export async function POST({ request }) {
	const form = await request.formData();
  let rq = form.get("query")
  if (!rq) {
    return json({ error: 'no query recieved' }, { status: 400 });
  }

  const parser = new Parser();
  let query = parser.parse(rq as string)
  if (query.type !== 'query') return json({ error: 'update query recieved: not allowed' }, { status: 400 });
  query = query as Query
  if (query.queryType !== 'SELECT') return json({ error: `${query.queryType} query recieved: not allowed` }, { status: 400 });
  query = query as SelectQuery
  if (query.limit && query.limit > 100) query.limit = 100
  else if (!query.limit) query.limit = 50

  if (!query.base) {
    query.base = 'mystery:'
  }
  rq = (new Generator()).stringify(query)
  const endpoint = SPARQL_ENDPOINT ?? 'http://localhost:3030/sparql-murder-mystery/sparql'

  return fetch(endpoint, {
    body: "query=" + encodeURIComponent(rq),
    cache: "default",
    credentials: "omit",
    headers: {
      Accept: "application/sparql-results+json",
      'Cache-Control': "no-cache",
      'Content-Type': "application/x-www-form-urlencoded",
      Pragma: "no-cache"
    },
    method: "POST",
    mode: "cors",
    redirect: "follow"
  })
  .then(res => {
    if (!res.ok) {
      return json({status: res.status, error: res.statusText}, { status: res.status });
    }
    return res.json()
  }).then (result => json(result, {status: 200}))
  .catch(e => {
    return json(new Error(`Error loading API ${endpoint}: ${(e as Error).message}`),  {status: 500})
  })
}
