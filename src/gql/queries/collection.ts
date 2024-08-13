import { gql } from "@/__generated__";

export const getCollectionQuery = gql(/* GraphQL */ `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      ...collection
      products(first: 1) {
        filters {
          ...filter
        }
      }
    }
  }
`);

export const getCollectionProductsQuery = gql(/* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      products(
        first: 24
        after: $after
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        ...products
      }
    }
  }
`);
