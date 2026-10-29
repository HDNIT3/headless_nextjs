export const GET_COUPONS_QUERY = `
  query GetCoupons($first: Int = 50) {
    coupons(first: $first) {
      nodes {
        id
        databaseId
        code
        description
        discountType
        amount
        dateExpiry
        freeShipping
        minimumAmount
        maximumAmount
        individualUse
        usageLimit
        usageCount
        productCategories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;
