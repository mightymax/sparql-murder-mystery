// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace bootstrap {
		
	}

	interface Binding {
		type: 'literal' | 'uri' | 'blanknode', 
		value: string, 
		datatype?: string
	}
	interface SparqlResults {
		head: {vars: string[]}
		results: {
			bindings: Array<Record<string, Binding>>
		}
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
	interface Yasqe {
		doc: {
			size: number
			heigh: number
		},
		display: {
			wrapper: HTMLElement
		} & unkown
		options: unkown
		setSize: (w: number|string, h: number|string) => void
		setValue: (v: string) => void
		collapsePrefixes: (v: boolean) => void
		getValue: () => string
		query: () => void
		on(eventName: "error", handler: (instance: Yasqe, e: Error) => void): void;
		on(eventName: "queryResults", handler: (instance: Yasqe, results: SparqlResults, duration: number) => void): void;
		on(eventName: "change", handler: (instance: Yasqe) => void): void;
		on(eventName: "query", handler: (instance: Yasqe) => void): void;
		// on: (eventName: "queryResponse", handler: (instance: Yasqe, req: unknown, duration: number) => void) => void;
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
	class Yasqe {
		constructor(node: HTMLElement, opts: unknown): Yasqe
	}
	
}

export {};
