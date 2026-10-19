export const GET_PRODUCT_CATEGORIES_QUERY = `
  query GetProductCategories {
    productCategories(first: 100, where: {orderby: COUNT, order: DESC}) {
      nodes {
        id
        databaseId
        name
        slug
        count
        parentId
      }
    }
  }
`;
