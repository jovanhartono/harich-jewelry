import { gql } from "@/__generated__";

export const getCarouselQuery = gql(/* GraphQL */ `
  query getCarousel {
    metaobjects(type: "home_carousel", first: 10) {
      edges {
        node {
          id
          header: field(key: "header") {
            value
          }
          description: field(key: "description") {
            value
          }
          cta: field(key: "cta") {
            value
          }
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
            ...video
          }
        }
      }
    }
  }
`);

export const getHomePageMainCollectionsQuery = gql(/* GraphQL */ `
  query getHomePageMainCollections {
    metaobject(handle: { type: "main_collection", handle: "top-collections" }) {
      title: field(key: "title") {
        key
        value
      }
      description: field(key: "description") {
        key
        value
      }
      collections: field(key: "collections") {
        key
        references(first: 100) {
          edges {
            node {
              ... on Collection {
                ...collection
              }
            }
          }
        }
      }
    }
  }
`);

export const getHeroQuery = gql(/* GraphQL */ `
  query getHero($handle: String!) {
    metaobject(handle: { type: "hero", handle: $handle }) {
      id
      url: field(key: "url") {
        value
      }
      desktop_file: field(key: "desktop_file") {
        reference {
          ... on MediaImage {
            image {
              ...image
            }
          }
          ... on Video {
            ...video
          }
        }
      }
      mobile_file: field(key: "mobile_file") {
        reference {
          ... on MediaImage {
            image {
              ...image
            }
          }
          ... on Video {
            ...video
          }
        }
      }
    }
  }
`);

export const getShopByRingShapeQuery = gql(/* GraphQL */ `
  query getShopByRingShape {
    metaobjects(type: "shop_by_ring_shape", first: 20) {
      edges {
        node {
          id
          label: field(key: "label") {
            key
            value
          }
          image: field(key: "image") {
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
