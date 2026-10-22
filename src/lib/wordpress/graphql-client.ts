const WP_GRAPHQL_URL =
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  'https://demo.wpgraphql.com/graphql';

interface GraphQLRequestOptions {
  /** `false` opts out of the Next.js data cache; a number sets the revalidation window. */
  revalidate?: number | false;
  tags?: string[];
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: unknown;
}

/**
 * Small WPGraphQL client used by the service layer.
 *
 * Requests are cached by Next.js (default: 60s) and can be tagged for
 * on-demand revalidation. Pass `revalidate: false` for data that must always
 * be fresh.
 */
export async function fetchGraphQL<T>(
  query: string,
  variables: object = {},
  options: GraphQLRequestOptions = {}
): Promise<T | null> {
  const { revalidate = 60, tags } = options;

  const cacheOptions: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  } =
    revalidate === false
      ? { cache: 'no-store' }
      : { next: { revalidate, tags } };

  try {
    const res = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      ...cacheOptions,
    });

    if (!res.ok) {
      console.warn(`[WPGraphQL] HTTP Error ${res.status}: ${res.statusText}`);
      return null;
    }

    const json = (await res.json()) as GraphQLResponse<T>;

    if (json.errors) {
      console.warn('[WPGraphQL] Query Errors:', json.errors);
      return null;
    }

    return json.data ?? null;
  } catch (error) {
    console.warn('[WPGraphQL] Connection failed:', error);
    return null;
  }
}
