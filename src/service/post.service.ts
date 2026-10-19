import { fetchGraphQL } from "@/lib/wordpress/graphql-client";
import { GET_NEWS_LIST_QUERY } from "@/lib/wordpress/queries/posts.graphql";
import { GetNewsListResponse, GetNewsListVariables } from "@/types/post";

export async function getNewsList(
  variables: GetNewsListVariables = { first: 10 }
): Promise<GetNewsListResponse> {
  const data = await fetchGraphQL<GetNewsListResponse>(
    GET_NEWS_LIST_QUERY,
    variables,
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


