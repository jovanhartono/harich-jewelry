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

export const getHomepageFirstSectionQuery = gql(/* GraphQL */ `
  query getHomepageFirstSection {
    metaobject(handle: { type: "home_first_section", handle: "content" }) {
      title: field(key: "title") {
        key
        value
      }
      description: field(key: "description") {
        key
        value
      }
      cta: field(key: "cta_navigation") {
        key
        value
      }
      video: field(key: "video") {
        reference {
          ... on Video {
            id
            mediaContentType
            previewImage {
              ...image
            }
            sources {
              mimeType
              url
            }
          }
        }
      }
    }
  }
`);
