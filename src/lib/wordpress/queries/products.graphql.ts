export const GET_PRODUCTS_QUERY = `
  query GetProducts(
    $first: Int = 12
    $after: String
    $search: String
  ) {
    products(
      first: $first
      after: $after
      where: {
        search: $search
      }
    ) {
      nodes {
        id
        title
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        thongtinsanpham {
          luTMua
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
        productAttrMauSacs {
          nodes {
            name
          }
        }
        productAttrKichThuocs {
          nodes {
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
`;

export const GET_PRODUCT_ATTR_KICH_THUOCS_QUERY = `
  query DanhSachKichThuoc {
    productAttrKichThuocs {
      nodes {
        name
      }
    }
  }
`;

export const GET_PRODUCT_ATTR_MAU_SACS_QUERY = `
  query DanhSachMauSac {
    productAttrMauSacs {
      nodes {
        name
      }
    }
  }
`;
