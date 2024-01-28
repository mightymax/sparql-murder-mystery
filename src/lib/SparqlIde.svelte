<script lang="ts">
  // const endpoint='http://localhost:3030/sparql-murder-mystery/sparql'
  const endpoint ='/sparql'
  const prefixes = {
    sdo: "https://schema.org/",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    xsd: "http://www.w3.org/2001/XMLSchema#"
  }
  const prefixesString = Object.keys(prefixes).map(ns => `prefix ${ns}: <${prefixes[ns as keyof typeof prefixes]}>`).join('\n')
  import { onMount } from 'svelte';
  let fullscreenModal: bootstrap.Modal
  let fullscreenModalContainer: HTMLElement
  let fullscreenModalBody: HTMLElement
  export let lines: number | undefined = undefined
  export let solution: string | undefined = undefined
  export let columnStyles: string[] = []
  const getQuery = (query?: string) => 
    'base <mystery:>\n' + 
    prefixesString + '\n' + (query ?? sparqlIdeEditorNode.innerHTML)
    .replaceAll('&lbrace;', '{')
    .replaceAll('&rbrace;', '}')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')

  let sparqlIdeContainer: HTMLElement
  let sparqlIdeContainerChildnodes: HTMLElement
  let sparqlIdeEditorNode: HTMLElement
  let editor: Yasqe
  export let validator: ((results: Record<string, Binding>) => boolean) | undefined = undefined

  const render = (binding: Binding) => {
    if (binding.type === 'uri') {
      if (binding.value.startsWith('http')) {
        let iri = binding.value
        for (const ns of Object.keys(prefixes)) {
          if (iri.startsWith(prefixes[ns as keyof typeof prefixes])) {
            iri = iri.replace(prefixes[ns as keyof typeof prefixes], ns + ':')
            break
          }
        }
        return `<span style="white-space: nowrap"><a href="${binding.value}" target="_blank">${iri}</a> <i class="bi bi-box-arrow-up-right text-secondary fs-10"></i></span>`
      } else {
        return `<span style="white-space: nowrap">&lt;<code>${binding.value.replace('mystery:', '')}</code>&gt;</span>`
      }
    }
    let value = binding.value
    if (binding.datatype) {
      if (binding.datatype.startsWith('http://www.w3.org/2001/XMLSchema#int')) value = parseInt(value).toLocaleString()
      value += `<sup>^^&lt;<a href="${binding.datatype}" target="_blank">xsd:${binding.datatype.replace('http://www.w3.org/2001/XMLSchema#', '')}</a>&gt;</sup>`
    }
    return value
  }

  const resize = (editor: Yasqe, $lines?: number) => {
    let lines = $lines ?? editor.doc.size
    if ($lines !== undefined && lines < $lines) lines = $lines
    editor.setSize('100%', ((lines -1)* 20))
  }

  let results: SparqlResults | undefined
  let error: Error | undefined = undefined

  let query: string

  const reset = () => {
    results = undefined
    editor.setValue(query)
    editor.collapsePrefixes(true)
    error = undefined
    resize(editor, lines)
  }

  const resetButton = () => {
    const b = document.createElement('button')
    b.classList.add('btn', 'btn-secondary')
    b.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i> reset'
    b.onclick = reset
    return b
  }

  const queryButton = () => {
    const b = document.createElement('button')
    b.classList.add('btn', 'btn-secondary', 'btn-search')
    b.innerHTML = `<i class="bi bi-search"></i> search`
    b.onclick = () => editor.query()
    return b
  }

  const solutionButton = () => {
    const b = document.createElement('button')
    b.classList.add('btn', 'btn-secondary', 'btn-solution')
    b.innerHTML = `<i class="bi bi-question-square-fill"></i>`
    b.onclick = () => {
      results = undefined
      editor.setValue(getQuery(solution))
      editor.collapsePrefixes(true)
      resize(editor)
    }
    return b
  }

  const fullscreenButton = () => {
    const iconFullscreen = '<i class="bi bi-arrows-fullscreen"></i>'
    const iconFullscreenExit = '<i class="bi bi-fullscreen-exit"></i>'
    if (fullscreenModal === undefined) {
      fullscreenModalContainer.addEventListener('hidden.bs.modal', event => {
        editor.display.wrapper.querySelector('.btn-fullscreen').innerHTML = iconFullscreen
        sparqlIdeContainer.appendChild(
          fullscreenModalBody.removeChild(sparqlIdeContainerChildnodes)
        )
      })
      fullscreenModal = new bootstrap.Modal(fullscreenModalContainer)
    }
    const b = document.createElement('button')
    b.classList.add('btn', 'btn-secondary', 'btn-fullscreen')
    b.innerHTML = iconFullscreen
    b.onclick = () => {
      if (b.innerHTML === iconFullscreen) {
        editor.display.wrapper.querySelector('.btn-fullscreen').innerHTML = iconFullscreenExit
        fullscreenModalBody.appendChild(
          sparqlIdeContainer.removeChild(sparqlIdeContainerChildnodes)
        )
      }
      fullscreenModal.toggle()
    }
    return b
  }

  const pluginButtons: () => Array<HTMLButtonElement> = () => {
    const buttons = [fullscreenButton()]
    if (solution !== undefined) {
      buttons.push(solutionButton())
    }
    buttons.push(resetButton(), queryButton())
    return buttons
  }


  onMount(() => {
    query = getQuery()
    sparqlIdeEditorNode.innerHTML = ''
    editor = new Yasqe(sparqlIdeEditorNode, { 
      createShortLink: false,  
      requestConfig: { 
        endpoint,
        method: 'POST'
      },
      showQueryButton: false,
      pluginButtons
    });
    reset()
    resize(editor, lines)
    editor.on('queryResults', (editor, $results) => {
      results = $results
      const btnSearch = editor.display.wrapper.querySelector('.btn-search')
      btnSearch?.classList.toggle('btn-secondary')
      btnSearch?.classList.toggle('btn-info')
      const i = btnSearch?.querySelector('i')
      i?.classList.toggle('bi-hourglass-split')
      i?.classList.toggle('bi-search')
    })
    editor.on('change', (editor) => resize(editor, lines))
    editor.on('query', (editor) => {
      const btnSearch = editor.display.wrapper.querySelector('.btn-search')
      btnSearch?.classList.toggle('btn-secondary')
      btnSearch?.classList.toggle('btn-info')
      const i = btnSearch?.querySelector('i')
      i?.classList.toggle('bi-hourglass-split')
      i?.classList.toggle('bi-search')
      error = undefined
    })
    editor.on('error', (editor, $error) => {
      error = $error
      results = undefined
      const btnSearch = editor.display.wrapper.querySelector('.btn-search')
      btnSearch?.classList.toggle('btn-secondary')
      btnSearch?.classList.toggle('btn-info')
      const i = btnSearch?.querySelector('i')
      i?.classList.toggle('bi-hourglass-split')
      i?.classList.toggle('bi-search')
    })
  })

  const tdStyle = (column: number) => {
    if (columnStyles.length >= (column+1) && columnStyles[column] !== '') {
      return columnStyles[column]
    } else {
      return ''
    }
  }
</script>
<style>
  .iri {
    white-space: nowrap !important;
  }
  .answer-correct {
    width: 1px;
    padding-right: 10px;
  }
</style>
<sup style="display: none;" class="iri"></sup>
<div bind:this={sparqlIdeContainer}>
  <div bind:this={sparqlIdeContainerChildnodes}>
    <div bind:this={sparqlIdeEditorNode}><slot /></div>
    {#if error !== undefined}
    <div class="alert alert-warning" role="alert">
      <p>Your SPARQL query did not result in a succesful response. 
      This might be because your query contains syntax error (watch the editor for hints!),
      or the SPARQL endpoint was not able to process the results on time, and casued a timeout.</p>
      <p>Error message: <code>{error.message}</code></p>
    </div>
    {/if}
    {#if results !== undefined}
      {#if results.results.bindings.length === 0}
        <div class="alert alert-warning" role="alert">
          <p>Your SPARQL query was correct, but it did not return any results. 
            Remember that you can always click the <em>reset</em> button to go to the original query.</p>
        </div>
      {:else}
        <table class="table table-hover table-sm">
          <thead>
            <tr>
                <th style="width:1px" scope="col">#</th>
              {#each results.head.vars as head}
                <th scope="col">{head}</th>
              {/each}
              {#if validator !== undefined}
                <th class="answer-correct"><i class="bi bi-question-square-fill fs-4 text-secondary"></i></th>
              {/if}
            </tr>
          </thead>
          <tbody>
            {#each results.results.bindings as binding, row}
            <tr class:table-success={validator !== undefined && validator(binding) === true}>
              <th style="width:1px" scope="row">{row+1}</th>
              {#each results.head.vars as head, col}
              <td style={tdStyle(col)}>{@html render(binding[head])}</td>
              {/each}
              {#if validator !== undefined}
              <td class="answer-correct">
                {#if validator(binding) === true}
                  <i class="bi bi-check-square-fill fs-4 text-success"></i>
                {/if}
              </td>
              {/if}
            </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    {/if}
  </div>
</div>

<div id="SparqlIde" class="modal " tabindex="-1" bind:this={fullscreenModalContainer}>
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">SPARQL Murder Mystery | SPARQL Editor</h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" bind:this={fullscreenModalBody}>
      </div>
    </div>
  </div>
</div>
