import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Image } from "@nextui-org/image";

import { CollectionProducts } from "@/components/collection/collection-products";
import { subtitle, title as titleClassName } from "@/components/primitives";
import { getCollection } from "@/lib/shopify";
import { generateSrcSet } from "@/lib/utils";

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
      {/*  TODO: art direction */}

      {collection.desktop_media?.reference?.__typename === "MediaImage" ? (
        <Image
          width="100%"
          height={400}
          classNames={{
            img: "object-cover",
          }}
          srcSet={generateSrcSet(collection.desktop_media.reference.image?.url)}
          src={collection.desktop_media.reference.image?.url}
          sizes="100vw"
          radius="none"
        />
      ) : null}

      <dl className="container">
        <dt className={titleClassName({ class: "capitalize" })}>
          {collection.title}
        </dt>
        <dd className={subtitle({ className: "line-clamp-3 md:line-clamp-4" })}>
          {collection.description}
        </dd>
      </dl>

      <CollectionProducts collection={collection} />
    </div>
  );
}
