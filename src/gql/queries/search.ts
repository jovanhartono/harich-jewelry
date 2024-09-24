import { gql } from "@/__generated__";

export const getSearchQuery = gql(/* GraphQL */ `
  query getSearch(
    $query: String!
    $sortKey: SearchSortKeys
    $after: String
    $filters: [ProductFilter!]
    $reverse: Boolean
  ) {
    search(
      first: 24
      after: $after
      query: $query
      sortKey: $sortKey
      types: PRODUCT
      productFilters: $filters
      reverse: $reverse
    ) {
      totalCount
      edges {
        node {
          ... on Product {
            ...compactProduct
          }
        }
      }
      productFilters {
        ...filter
      }
      pageInfo {
        ...pageInfo
      }
    }
  }
`);

export const getSearchRecommendationQuery = gql(/* GraphQL */ `
  query getSearchRecommendation($query: String!) {
    predictiveSearch(query: $query) {
      queries {
        text
        styledText
        trackingParameters
      }
      products {
        ...product
      }
    }
  }
`);
