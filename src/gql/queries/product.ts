import { gql } from "@/__generated__";
import { graphql } from "graphql/graphql";

export const getProductByHandleQuery = gql(/* GraphQL */ `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...product
      stoneCertificate: metafield(namespace: "stone", key: "certificate") {
        reference {
          ... on MediaImage {
            image {
              ...image
            }
          }
        }
      }
      stoneSpecifications: metafields(
        identifiers: [
          { namespace: "stone", key: "carat" }
          { namespace: "stone", key: "clarity" }
          { namespace: "stone", key: "color" }
        ]
      ) {
        key
        value
      }
      shape: metafield(namespace: "stone", key: "shape") {
        ...stoneShape
      }
      shapeReference: metafield(
        namespace: "ring"
        key: "product_shape_reference"
      ) {
        references(first: 100) {
          edges {
            node {
              ... on Product {
                ...product
                cut: metafield(namespace: "stone", key: "shape") {
                  ...stoneShape
                }
              }
            }
          }
        }
      }
    }
  }
`);
