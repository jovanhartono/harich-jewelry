import { notFound } from "next/navigation";
import { ImageFragment, MenuItem } from "@/__generated__/graphql";
import { query } from "@/../apollo-client";
import {
  getArticleQuery,
  getBlogQuery,
  getBlogsQuery,
} from "@/gql/queries/blog";
import { getCollectionQuery } from "@/gql/queries/collection";
import { getMenuQuery } from "@/gql/queries/menu";
import {
  getCarouselQuery,
  getHeroQuery,
  getHomepageFirstSectionQuery,
} from "@/gql/queries/meta-object";
import { getPageQuery, getPagesQuery } from "@/gql/queries/page";
import { getProductByHandleQuery } from "@/gql/queries/product";

import { TAGS } from "@/lib/constant";
import { MetaObjectUrl, StoneSpecifications } from "@/lib/type";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

export const getProductByHandle = async (handle: string) => {
  const { data } = await query({
    query: getProductByHandleQuery,
    variables: {
      handle,
    },
    context: {
      fetchOptions: {
        next: { tags: [TAGS.products] },
      },
    },
  });

  if (!data.product) {
    return notFound();
  }

  const { product } = data;

  const shapeReference =
    product.shapeReference?.references?.edges
      .map(({ node }) => {
        if (
          node.__typename === "Product" &&
          node.cut?.reference?.__typename === "Metaobject"
        ) {
          const shapeRef = node.cut?.reference;

          return {
            ...node,
            shape: {
              label: shapeRef.label?.value || "",
              svgUrl:
                shapeRef.svg?.reference?.__typename === "MediaImage"
                  ? shapeRef.svg.reference.image?.url
                  : undefined,
            },
          };
        }

        return null;
      })
      .filter((edge) => edge !== null) || [];

  const stoneCertificate =
    product.stoneCertificate?.reference?.__typename === "MediaImage"
      ? product.stoneCertificate?.reference?.image
      : undefined;

  const stoneSpecifications = product.stoneSpecifications.reduce(
    (acc, curr) => {
      const key = curr?.key as keyof StoneSpecifications;
      if (!acc[key]) {
        acc[key] = curr?.value as never;
      }

      return acc;
    },
    {} as StoneSpecifications,
  );

  return {
    ...product,
    variants: product.variants.edges.map((edge) => edge.node) || [],
    shapeReference,
    stoneCertificate,
    stoneSpecifications,
  };
};

export const getMenu = async (handle: string) => {
  const { data } = await query({
    query: getMenuQuery,
    variables: {
      handle,
    },
    context: {
      fetchOptions: {
        next: { revalidate: 10 },
      },
    },
  });

  const handleMenu = (items: MenuItem[]): Array<MenuItem> => {
    return items.map((item) => ({
      ...item,
      url: item.url.replace(domain, ""),
      items: item.items?.length > 0 ? handleMenu(item.items) : [],
    }));
  };

  return data.menu?.items ? handleMenu(data.menu.items) : [];
};

export async function getHeroCarousel() {
  const { data } = await query({
    query: getCarouselQuery,
    context: {
      fetchOptions: {
        next: { revalidate: 30 },
      },
    },
  });

  return data.metaobjects.edges.reduce(
    (acc, { node: curr }, index) => {
      acc.push({
        url: curr.url?.value || "#",
      });

      if (curr.desktop_image?.reference?.__typename === "MediaImage") {
        acc[index].desktop_image = curr.desktop_image.reference.image;
      }

      if (curr.mobile_image?.reference?.__typename === "MediaImage") {
        acc[index].mobile_image = curr.mobile_image.reference.image;
      }

      return acc;
    },
    [] as Array<{
      desktop_image?: ImageFragment | null;
      mobile_image?: ImageFragment | null;
      url: string;
    }>,
  );
}

export async function getHomepageFirstSection() {
  const {
    data: { metaobject },
  } = await query({
    query: getHomepageFirstSectionQuery,
    context: {
      fetchOptions: {
        next: { revalidate: 30 },
      },
    },
  });

  return {
    title: metaobject?.title?.value || "",
    description: metaobject?.description?.value || "",
    cta: metaobject?.cta?.value
      ? (JSON.parse(metaobject.cta.value) as MetaObjectUrl)
      : undefined,
    video:
      metaobject?.video?.reference?.__typename === "Video"
        ? metaobject?.video?.reference
        : undefined,
  };
}

export async function getPage(handle: string) {
  const { data } = await query({
    query: getPageQuery,
    variables: {
      handle,
    },
  });

  return data.page;
}

export async function getPages() {
  const { data } = await query({
    query: getPagesQuery,
  });

  return data.pages.edges.map((edge) => edge.node);
}

export async function getBlog(handle: string) {
  const { data } = await query({
    query: getBlogQuery,
    variables: {
      handle,
    },
  });

  if (!data.blog) {
    return notFound();
  }

  return {
    ...data.blog,
    articles: data.blog.articles.edges.map((edge) => edge.node),
  };
}

export async function getBlogs() {
  const { data } = await query({
    query: getBlogsQuery,
  });

  return data.blogs.edges.map(({ node }) => node);
}

export async function getArticle({
  articleHandle,
  blogHandle,
}: {
  blogHandle: string;
  articleHandle: string;
}) {
  const { data } = await query({
    query: getArticleQuery,
    variables: {
      articleHandle,
      blogHandle,
    },
  });

  if (!data.blog?.articleByHandle) {
    return notFound();
  }

  return data.blog.articleByHandle;
}

export const getCollection = async ({ handle }: { handle: string }) => {
  const { data, ...response } = await query({
    query: getCollectionQuery,
    variables: {
      handle,
    },
    context: {
      fetchOptions: {
        next: { tags: [TAGS.collections] },
      },
    },
  });

  return {
    collection: data.collection,
    ...response,
  };
};

export async function getHeroImage(handle: string) {
  const { data } = await query({
    query: getHeroQuery,
    variables: {
      handle,
    },
    context: {
      fetchOptions: {
        next: { revalidate: 30 },
      },
    },
  });

  const desktop_file = data.metaobject?.desktop_file?.reference;
  const mobile_file = data.metaobject?.mobile_file?.reference;

  return {
    ...data.metaobject,
    desktop_file,
    mobile_file,
  };
}
