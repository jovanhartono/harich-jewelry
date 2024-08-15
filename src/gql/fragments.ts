import { gql } from "@/__generated__";

export const imageFragment = gql(/* GraphQL */ `
  fragment image on Image {
    url
    altText
    width
    height
  }
`);

export const videoFragment = gql(/* GraphQL */ `
  fragment video on Video {
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
`);

export const collectionFragment = gql(/* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    seo {
      ...seo
    }
    desktop_media: metafield(namespace: "collection", key: "dekstop_image") {
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
    mobile_media: metafield(namespace: "collection", key: "mobile_image") {
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
    updatedAt
  }
`);

export const productVariantFragment = gql(/* GraphQL */ `
  fragment productVariant on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    selectedOptions {
      name
      value
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
    }
  }
`);

export const productCardFragment = gql(/* GraphQL */ `
  fragment productCard on Product {
    id
    handle
    title
    compareAtPriceRange {
      minVariantPrice {
        amount
      }
      maxVariantPrice {
        amount
      }
    }
    featuredImage {
      ...image
    }
  }
`);

export const productFragment = gql(/* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    productType
    description
    descriptionHtml
    featuredImage {
      ...image
    }
    images(first: 250) {
      edges {
        node {
          ...image
        }
      }
    }
    options {
      id
      name
      values
    }
    productType
    vendor
    compareAtPriceRange {
      minVariantPrice {
        amount
      }
      maxVariantPrice {
        amount
      }
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          ...productVariant
        }
      }
    }
    seo {
      ...seo
    }
  }
`);

export const seoFragment = gql(/* GraphQL */ `
  fragment seo on SEO {
    description
    title
  }
`);

export const pageInfoFragment = gql(/* GraphQL */ `
  fragment pageInfo on PageInfo {
    hasPreviousPage
    hasNextPage
    startCursor
    endCursor
  }
`);

export const filterFragment = gql(/* GraphQL */ `
  fragment filter on Filter {
    id
    label
    type
    values {
      id
      label
      count
      input
      image {
        image {
          ...image
        }
      }
    }
  }
`);

export const productsFragment = gql(/* GraphQL */ `
  fragment products on ProductConnection {
    edges {
      node {
        ...product
      }
    }
    pageInfo {
      ...pageInfo
    }
  }
`);

export const cartLineFragment = gql(/* GraphQL */ `
  fragment cartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      amountPerQuantity {
        amount
        currencyCode
      }
      compareAtAmountPerQuantity {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        title
        quantityAvailable
        selectedOptions {
          name
          value
        }
        product {
          ...product
        }
      }
    }
  }
`);

export const cartFragment = gql(/* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    attributes {
      key
      value
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    discountCodes {
      applicable
      code
    }
    discountAllocations {
      discountedAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          ...cartLine
        }
      }
    }
    totalQuantity
  }
`);

export const pageFragment = gql(/* GraphQL */ `
  fragment page on Page {
    id
    title
    handle
    body
    bodySummary
    seo {
      ...seo
    }
    createdAt
    updatedAt
  }
`);

export const menuFragment = gql(/* GraphQL */ `
  fragment menuItem on MenuItem {
    id
    title
    url
    tags
    type
  }
`);

export const ArticleFragment = gql(/* GraphQL */ `
  fragment article on Article {
    id
    blog {
      handle
      title
    }
    handle
    title
    excerpt
    image {
      ...image
    }
    contentHtml
    seo {
      ...seo
    }
  }
`);

export const BlogFragment = gql(/* GraphQL */ `
  fragment blog on Blog {
    id
    title
    handle
    seo {
      ...seo
    }
    articles(first: 250) {
      edges {
        node {
          ...article
        }
      }
    }
  }
`);

export const StoneShapeFragment = gql(/* GraphQL */ `
  fragment stoneShape on Metafield {
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
`);
