export const GET_GALLERY_QUERY = `
  query GetGallery($first: Int = 100) {
    allDanhSChNh(
      first: $first
      where: { orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        databaseId
        title
        slug
        date
        uri
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        phNLoINh {
          nodes {
            databaseId
            name
            slug
            count
          }
        }
      }
    }

    allPhNLoINh(first: 100, where: { hideEmpty: true }) {
      nodes {
        databaseId
        name
        slug
        count
      }
    }
  }
`;
