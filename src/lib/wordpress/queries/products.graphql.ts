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
        databaseId
        name
        slug
        image {
          sourceUrl
          altText
        }

        ... on WithAcfThongtinsanpham {
          thongtinsanpham {
            luotmua
          }
        }

        ... on Product {
          price
          regularPrice
          salePrice
          productSizes
          productColors
          productCategories {
            nodes {
              name
              slug
            }
          }
          attributes {
            nodes {
              name
              options
            }
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

export const GET_PRODUCT_DETAIL_QUERY = `
  query GetProductDetail($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      image {
        sourceUrl
        altText
      }

      ... on Product {
        price
        regularPrice
        salePrice
        productSizes
        productColors
        galleryImages {
          nodes {
            id
            sourceUrl
            altText
          }
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
        attributes {
          nodes {
            name
            options
          }
        }
      }

      ... on WithAcfThongtinsanpham {
        thongtinsanpham {
          luTXem
          luotmua
          chatlieu
          doday
          taitrong
          congdung
          ungdungchitiet
          visaonensudung
        }
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
