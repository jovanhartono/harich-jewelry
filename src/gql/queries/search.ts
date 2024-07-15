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
            ...product
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
    cheapestPrice: search(
      query: $query
      types: PRODUCT
      first: 1
      sortKey: PRICE
    ) {
      edges {
        node {
          ... on Product {
            priceRange {
              minVariantPrice {
                amount
              }
            }
          }
        }
      }
    }
    mostExpensivePrice: search(
      query: $query
      types: PRODUCT
      first: 1
      sortKey: PRICE
      reverse: true
    ) {
      edges {
        node {
          ... on Product {
            priceRange {
              maxVariantPrice {
                amount
              }
            }
          }
        }
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
