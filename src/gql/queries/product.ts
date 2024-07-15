import { gql } from "@/__generated__";

export const getProductByHandleQuery = gql(/* GraphQL */ `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
`);
