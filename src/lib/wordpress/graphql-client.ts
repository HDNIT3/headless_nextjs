import { DEFAULT_REVALIDATE } from '@/lib/constants/cache';

const WP_BASE_URL =
  process.env.WORDPRESS_URL ||
  (process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL)?.replace(/\/graphql\/?$/i, '') ||
  'http://localhost/prj';

const WP_GRAPHQL_URL =
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  `${WP_BASE_URL.replace(/\/+$/, '')}/graphql`;

interface GraphQLRequestOptions {
  revalidate?: number | false;
  tags?: string[];
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: unknown;
}

export async function fetchGraphQL<T>(
  query: string,
  variables: object = {},
  options: GraphQLRequestOptions = {}
): Promise<T | null> {
  const { revalidate = DEFAULT_REVALIDATE, tags } = options;

  const cacheOptions: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  } =
    revalidate === false || revalidate === 0
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
