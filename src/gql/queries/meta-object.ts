import { gql } from "@/__generated__";

export const getCarouselQuery = gql(/* GraphQL */ `
  query getCarousel {
    metaobjects(type: "home_carousel", first: 10) {
      edges {
        node {
          id
          url: field(key: "url") {
            value
          }
          desktop_image: field(key: "desktop_image") {
            reference {
              ... on MediaImage {
                image {
                  ...image
                }
              }
            }
          }
          mobile_image: field(key: "mobile_image") {
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
`);
