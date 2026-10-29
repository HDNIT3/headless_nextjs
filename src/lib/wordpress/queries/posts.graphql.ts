export const GET_POST_DETAIL_QUERY = `
  query GetPostDetail($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      slug
      title
      excerpt
      content
      date
      categories {
        nodes {
          id
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export const GET_NEWS_LIST_QUERY = `
  query GetNewsList($first: Int = 10, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        slug
        title
        excerpt
        content
        date
        categories {
          nodes {
            id
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;
