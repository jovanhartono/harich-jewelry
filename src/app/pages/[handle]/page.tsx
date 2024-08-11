import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { title } from "@/components/primitives";
import { Prose } from "@/components/prose";
import { getPage, getPages } from "@/lib/shopify";

export const revalidate = 30;
export const dynamicParams = true;
export async function generateStaticParams() {
  const pages = await getPages();

  return pages.map(({ handle }) => ({ handle }));
}

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const page = await getPage(params.handle);

  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: "article",
    },
  };
}

export default async function Page({ params }: { params: { handle: string } }) {
  const page = await getPage(params.handle);

  if (!page) return notFound();

  return (
    <article className="container mx-auto h-full min-h-96 max-w-screen-md py-6 xl:py-9">
      <h1 className={title({ className: "block text-center" })}>
        {page.title}
      </h1>
      <Prose body={page.body} />
    </article>
  );
}
