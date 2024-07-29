import { notFound } from "next/navigation";
import { ImageFragment, MenuItem } from "@/__generated__/graphql";
import { query } from "@/../apollo-client";
import { getMenuQuery } from "@/gql/queries/menu";
import { getCarouselQuery } from "@/gql/queries/meta-object";
import { getProductByHandleQuery } from "@/gql/queries/product";

import { TAGS } from "@/lib/constant";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

export const getProductByHandle = async (handle: string) => {
  const { data } = await query({
    query: getProductByHandleQuery,
    variables: {
      handle,
      includeMetalType: true,
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
    metalTypeReferences:
      product.metalTypeReferences?.references?.edges.map((edge) => edge.node) ||
      [],
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
