import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilterProvider } from "@/providers/filter-provider";

import CollectionHero from "@/components/collection/collection-hero";
import { CollectionProducts } from "@/components/collection/collection-products";
import { CollectionOrganizerWrapper } from "@/components/collection/organizer/collection-organizer-wrapper";
import { getCollection, getCollections } from "@/lib/shopify";

export const dynamicParams = true;
export async function generateStaticParams() {
  const { handles } = await getCollections();

  return handles.map(({ handle }) => ({ handle }));
}

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { collection } = await getCollection({
    handle: params.handle,
  });

  return {
    title: collection?.seo.title || collection?.title,
    description: collection?.seo.description,
  };
}

export default async function Page(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const { collection } = await getCollection({
    handle: params.handle,
  });

  if (!collection) {
    return notFound();
  }

  return (
    <div className="flex flex-col pb-12">
      <CollectionHero
        // @ts-ignore
        desktop_file={collection.desktop_media?.reference}
        // @ts-ignore
        mobile_file={collection.mobile_media?.reference}
      />
      <FilterProvider filters={collection.products.filters}>
        <Suspense>
          <CollectionOrganizerWrapper />
        </Suspense>
        <Suspense>
          <CollectionProducts collection={collection} />
        </Suspense>
      </FilterProvider>
    </div>
  );
}
