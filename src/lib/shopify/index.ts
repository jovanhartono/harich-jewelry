import { notFound } from "next/navigation";
import { MenuItem } from "@/__generated__/graphql";
import { query } from "@/../apollo-client";
import { getMenuQuery } from "@/gql/queries/menu";
import { getProductByHandleQuery } from "@/gql/queries/product";

import { TAGS } from "@/lib/constant";

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

  return {
    ...product,
    variants: product.variants.edges.map((edge) => edge.node) || [],
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
