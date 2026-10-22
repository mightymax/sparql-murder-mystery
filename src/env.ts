import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({ SPARQL_ENDPOINT: { schema: (input) => input ?? '' } });
