import { notFound } from "next/navigation";
import BuildStepper from "@/app/engagement-rings/build-stepper";
import { Image } from "@nextui-org/image";

import { CollectionProducts } from "@/components/collection/collection-products";
import { subtitle, title as titleClassName } from "@/components/primitives";
import { COLLECTION_HANDLE } from "@/lib/constant";
import { getCollection } from "@/lib/shopify";
import { generateSrcSet } from "@/lib/utils";

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

      {/*<dl className="container">*/}
      {/*  <dt className={titleClassName({ class: "capitalize" })}>*/}
      {/*    {collection.title}*/}
      {/*  </dt>*/}
      {/*  <dd className={subtitle({ className: "line-clamp-3 md:line-clamp-4" })}>*/}
      {/*    {collection.description}*/}
      {/*  </dd>*/}
      {/*</dl>*/}

      <BuildStepper type={params.type} />

      <CollectionProducts collection={collection} />
    </div>
  );
}
