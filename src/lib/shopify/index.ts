import { notFound } from "next/navigation";
import { ImageFragment, MenuItem } from "@/__generated__/graphql";
import { getClient, query } from "@/../apollo-client";
import { createCartMutation } from "@/gql/mutations/cart";
import {
  getArticleQuery,
  getBlogQuery,
  getBlogsQuery,
} from "@/gql/queries/blog";
import { getCartQuery } from "@/gql/queries/cart";
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
import { MetaObjectUrl } from "@/lib/type";
import { handleProductQuery } from "@/lib/utils";

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

  const product = handleProductQuery(data);

  if (!product) {
    return notFound();
  }

  return product;
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

export async function createCart() {
  const { data, errors } = await getClient().mutate({
    mutation: createCartMutation,
    fetchPolicy: "no-cache",
  });
  const lines =
    data?.cartCreate?.cart?.lines.edges.map((edge) => edge.node) ?? [];

  return { cart: { ...data?.cartCreate?.cart, lines }, errors };
}

export async function getCart(cartId: string) {
  const { data } = await query({
    query: getCartQuery,
    fetchPolicy: "no-cache",
    variables: {
      cartId,
    },
    context: {
      fetchOptions: {
        next: { tags: [TAGS.cart] },
      },
    },
  });

  // Old carts becomes `null` when you check out.
  if (!data.cart) {
    return undefined;
  }

  return {
    ...data.cart,
    lines: data.cart.lines.edges.map((edge) => edge.node),
  };
}
