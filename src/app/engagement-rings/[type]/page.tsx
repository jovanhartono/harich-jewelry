import { notFound } from "next/navigation";

import { CollectionProducts } from "@/components/collection/collection-products";
import { COLLECTION_HANDLE } from "@/lib/constant";
import { getCollection } from "@/lib/shopify";

export default async function EngagementRingsPage({
  params,
}: {
  params: { type: string };
}) {
  if (params.type !== "setting" && params.type !== "stone") {
    return notFound();
  }

  const { collection } = await getCollection({
    handle: COLLECTION_HANDLE[params.type],
  });

  if (!collection) {
    return notFound();
  }

  return <CollectionProducts collection={collection} />;
}
