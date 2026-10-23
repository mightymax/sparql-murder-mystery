# SPARQL Murder Mystery

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Data
The gamedata can be populated by running `node ./dv2rdf.js`

## SPARQL endpoint
To play around with the data, we can create a SPARQL endpoint:

First we build a [Jena TDB2](https://jena.apache.org/documentation/tdb2/) database:
```bash
docker run \
  -v `pwd`/data/mystery:/rdf mlindeman/jena \
  sh -c "rm -rf /rdf/fuseki/databases/mystery && find /rdf -name '*.ttl' -or -name '*.trig' | xargs tdb2.tdbloader --loc /rdf/fuseki/databases/mystery"
```

Now we can start the SPARQL endpoint and UI:
```bash
docker run --rm -p 3030:3030  -e FUSEKI_BASE=/rdf/fuseki \
  -v `pwd`/data/mystery:/rdf mlindeman/jena sh -c 'ls -alh /rdf/fuseki && fuseki'
```
The dataset can now be queried at http://localhost:3030/#/dataset/mystery/query.


## Releases en deployment

Werkmap: `~/Code/cluster/sparql-murder-mystery`. Commit en push wijzigingen eerst naar `main`.

```sh
npm version patch  # of minor / major
```

Dit maakt een versiecommit en v-tag en pusht beide automatisch naar GitHub. De
releaseworkflow bouwt uitsluitend `linux/arm64`, publiceert naar
`ghcr.io/mightymax/sparql-murder-mystery-app` en schrijft de versie plus image-digest naar
`infrastructure/overlays/prod/kustomization.yaml` op de branch `release`.
Argo CD volgt die branch en synchroniseert automatisch. Geen handmatige build,
`kubectl apply` of rollout restart nodig. Secrets blijven buiten Git.

Controle: `gh run list --workflow release.yml` en
`kubectl -n argocd get application sparql-murder-mystery.lindeman.it`.
Een mislukte build wijzigt de releasebranch niet.
