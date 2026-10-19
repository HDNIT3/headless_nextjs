const WP_GRAPHQL_URL =
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  'https://demo.wpgraphql.com/graphql';

export async function fetchGraphQL<T = any>(
  query: string,
  variables: Record<string, any> = {},
  options: {
    revalidate?: number | false;
    tags?: string[];  
  } = {}
): Promise<T | null> {
  const { tags } = options;

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
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`[WPGraphQL] HTTP Error ${res.status}: ${res.statusText}`);
      return null;
    }

    const json = await res.json();

    if (json.errors) {
      console.warn('[WPGraphQL] Query Errors:', json.errors);
      return null;
    }

    return json.data as T;
  } catch (error) {
    console.warn('[WPGraphQL] Connection failed:', error);
    return null;
  }
}

