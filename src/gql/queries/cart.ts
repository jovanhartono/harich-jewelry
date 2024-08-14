import { gql } from "@/__generated__";

export const getCartQuery = gql(/* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
`);
