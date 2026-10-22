/**
 * Gallery queries for the `danh-sach-anh` post type and `phan-loai-anh`
 * taxonomy.
 *
 * WPGraphQL generates Vietnamese-derived names for these custom types:
 * - `allDanhSChNh` = all `danh-sach-anh` posts
 * - `phNLoINh` = the `phan-loai-anh` taxonomy connection
 * - `allPhNLoINh` = all `phan-loai-anh` terms
 *
 * Keep these names isolated here so UI components never depend on the
 * WordPress-generated GraphQL naming.
 */
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
