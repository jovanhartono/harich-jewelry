import type { Metadata } from "next";
import { Image } from "@nextui-org/image";

import { title as titleStyle } from "@/components/primitives";
import { Prose } from "@/components/prose";
import { getArticle, getBlogs } from "@/lib/shopify";
import { generateSrcSet } from "@/lib/utils";

export const revalidate = 30;
export const dynamicParams = true;
export async function generateStaticParams() {
  const blogs = await getBlogs();

  return blogs.flatMap(({ articles }) =>
    articles.edges.map(({ node }) => ({
      blog: node.blog.handle,
      article: node.handle,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: { blog: string; article: string };
}): Promise<Metadata> {
  const { title, seo } = await getArticle({
    articleHandle: params.article,
    blogHandle: params.blog,
  });

  return {
    title: seo?.title || title,
    description: seo?.description,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { blog: string; article: string };
}) {
  const { title, contentHtml, image } = await getArticle({
    articleHandle: params.article,
    blogHandle: params.blog,
  });

  return (
    <article className="container max-w-screen-lg space-y-9 py-6 xl:py-9">
      <h1 className={titleStyle()}>{title}</h1>
      {image ? (
        <img
          className="aspect-video w-full object-cover object-center"
          alt={image.altText || title}
          src={image.url}
          srcSet={image.url ? generateSrcSet(image.url) : ""}
          sizes="(max-width: 768px) 100vw, 768w"
        />
      ) : null}
      <Prose body={contentHtml} />
    </article>
  );
}
