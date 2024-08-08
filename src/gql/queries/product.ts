import { gql } from "@/__generated__";

export const getProductByHandleQuery = gql(/* GraphQL */ `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...product
      stone_certificate: metafield(namespace: "stone", key: "certificate") {
        reference {
          ... on MediaImage {
            image {
              ...image
            }
          }
        }
      }
      stone_specifications: metafields(
        identifiers: [
          { namespace: "stone", key: "carat" }
          { namespace: "stone", key: "clarity" }
          { namespace: "stone", key: "color" }
        ]
      ) {
        key
        value
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
                cut: metafield(namespace: "stone", key: "cut") {
                  key
                  value
                  reference {
                    ... on Metaobject {
                      label: field(key: "label") {
                        key
                        value
                      }
                      svg: field(key: "svg") {
                        key
                        value
                        reference {
                          ... on MediaImage {
                            image {
                              ...image
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);
