import { gql } from "@/__generated__";

export const getPageQuery = gql(/* GraphQL */ `
  query getPage($handle: String!) {
    page(handle: $handle) {
      ... on Page {
        ...page
      }
    }
  }
`);

export const getPagesQuery = gql(/* GraphQL */ `
  query getPages {
    pages(first: 100) {
      edges {
        node {
          ...page
        }
      }
    }
  }
`);
