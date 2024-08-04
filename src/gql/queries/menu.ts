import { gql } from "@/__generated__";

export const getMenuQuery = gql(/* GraphQL */ `
  query getMainMenu($handle: String!) {
    menu(handle: $handle) {
      id
      handle
      itemsCount
      items {
        ...menuItem
        items {
          ...menuItem
          items {
            ...menuItem
          }
        }
      }
    }
  }
`);
