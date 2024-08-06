import { gql } from "@/__generated__";

export const getProductByHandleQuery = gql(/* GraphQL */ `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...product
      shapeReference: metafield(
        namespace: "ring"
        key: "product_shape_reference"
      ) {
        references(first: 100) {
          edges {
            node {
              ... on Product {
                ...product
                shape: metafield(namespace: "ring", key: "setting_style") {
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
      certificate: metafield(namespace: "stone", key: "certificate") {
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
`);
