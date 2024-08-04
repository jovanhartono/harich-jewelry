import { gql } from "@/__generated__";

export const getBlogQuery = gql(/* GraphQL */ `
  query getBlog($handle: String!) {
    blog(handle: $handle) {
      ...blog
    }
  }
`);

export const getBlogsQuery = gql(/* GraphQL */ `
  query getBlogs {
    blogs(first: 100) {
      edges {
        node {
          ...blog
        }
      }
    }
  }
`);

export const getArticleQuery = gql(/* GraphQL */ `
  query getArticle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        ...article
      }
    }
  }
`);
