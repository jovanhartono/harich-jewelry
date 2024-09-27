import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { FilterProvider } from "@/providers/filter-provider";

import CollectionHero from "@/components/collection/collection-hero";
import { CollectionProducts } from "@/components/collection/collection-products";
import { getCollection, getCollections } from "@/lib/shopify";

const CollectionOrganizer = dynamic(
  () =>
    import("@/components/collection/organizer/collection-organizer").then(
      (m) => m.CollectionOrganizer,
    ),
  {
    ssr: false,
  },
);

export const dynamicParams = true;
export async function generateStaticParams() {
  const { handles } = await getCollections();

  return handles.map(({ handle }) => ({ handle }));
}

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const { collection } = await getCollection({
    handle: params.handle,
  });

  return {
    title: collection?.seo.title || collection?.title,
    description: collection?.seo.description,
  };
}

export default async function Page({ params }: { params: { handle: string } }) {
  const { collection } = await getCollection({
    handle: params.handle,
  });

  if (!collection) {
    return notFound();
  }

  return (
    <Suspense>
      <FilterProvider filters={collection.products.filters}>
        <div className="flex flex-col pb-12">
          <CollectionHero
            desktop_file={collection.desktop_media?.reference}
            mobile_file={collection.mobile_media?.reference}
          />
          <CollectionOrganizer />
          <CollectionProducts collection={collection} />
        </div>
      </FilterProvider>
    </Suspense>
  );
}
