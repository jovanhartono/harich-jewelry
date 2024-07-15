import { notFound } from "next/navigation";
import { query } from "@/../apollo-client";
import { getProductByHandleQuery } from "@/gql/queries/product";

import { TAGS } from "@/lib/constant";

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
