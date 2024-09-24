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
        filters {
          ...filter
        }
      }
    }
  }
`);

export const getStoneCollectionQuery = gql(/* GraphQL */ `
  query getStoneCollection($filters: [ProductFilter!]) {
    collection(handle: "diamonds") {
      products(first: 100, filters: $filters) {
        edges {
          node {
            ...product
            stoneSpecifications: metafields(
              identifiers: [
                { namespace: "stone", key: "carat" }
                { namespace: "stone", key: "clarity" }
                { namespace: "stone", key: "color" }
                { namespace: "stone", key: "cut" }
              ]
            ) {
              key
              value
            }
            stoneShape: metafield(namespace: "stone", key: "shape") {
              ...stoneShape
            }
          }
        }
        pageInfo {
          ...pageInfo
        }
      }
    }
  }
`);
