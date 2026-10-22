import { cache } from 'react';
import { fetchGraphQL } from '@/lib/wordpress/graphql-client';
import {
  GET_NEWS_LIST_QUERY,
  GET_POST_DETAIL_QUERY,
} from '@/lib/wordpress/queries/posts.graphql';
import {
  GetNewsListResponse,
  GetNewsListVariables,
  GetPostDetailResponse,
  PostNode,
} from '@/types/post';

export async function getNewsList(
  variables: GetNewsListVariables = { first: 10 }
): Promise<GetNewsListResponse> {
  const data = await fetchGraphQL<GetNewsListResponse>(
    GET_NEWS_LIST_QUERY,
    { first: variables.first, after: variables.after },
    { revalidate: 60, tags: ['posts'] }
  );

  if (data?.posts?.nodes?.length) {
    return data;
  }

  return {
    posts: {
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
      nodes: [],
    },
  };
}

/**
 * Fetches a single post by slug. `cache` de-duplicates the call between
 * `generateMetadata` and the page render.
 */
export const getPostDetail = cache(
  async (slug: string): Promise<PostNode | null> => {
    const data = await fetchGraphQL<GetPostDetailResponse>(
      GET_POST_DETAIL_QUERY,
      { slug },
      { revalidate: 60, tags: ['posts', `post-${slug}`] }
    );

    return data?.post ?? null;
  }
);
