import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CollectionHero from "@/components/collection/collection-hero";
import { CollectionProducts } from "@/components/collection/collection-products";
import { getCollection } from "@/lib/shopify";

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
    <div className="flex flex-col gap-6 pb-12">
      <CollectionHero
        desktop_file={collection.desktop_media?.reference}
        mobile_file={collection.mobile_media?.reference}
      />

      {/*<dl className="container">*/}
      {/*  <dt className={titleClassName({ class: "capitalize" })}>*/}
      {/*    {collection.title}*/}
      {/*  </dt>*/}
      {/*  <dd className={subtitle({ className: "line-clamp-3 md:line-clamp-4" })}>*/}
      {/*    {collection.description}*/}
      {/*  </dd>*/}
      {/*</dl>*/}

      <CollectionProducts collection={collection} />
    </div>
  );
}
