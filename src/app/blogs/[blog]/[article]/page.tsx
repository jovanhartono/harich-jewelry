import type { Metadata } from "next";
import NextImage from "next/image";

import { title as titleStyle } from "@/components/primitives";
import { Prose } from "@/components/prose";
import { getArticle, getBlogs } from "@/lib/shopify";

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

export async function generateMetadata(props: {
  params: Promise<{ blog: string; article: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { title, seo } = await getArticle({
    articleHandle: params.article,
    blogHandle: params.blog,
  });

  return {
    title: seo?.title || title,
    description: seo?.description,
  };
}

export default async function ArticlePage(props: {
  params: Promise<{ blog: string; article: string }>;
}) {
  const params = await props.params;
  const { title, contentHtml, image } = await getArticle({
    articleHandle: params.article,
    blogHandle: params.blog,
  });

  return (
    <article className="container max-w-screen-lg space-y-9 py-6 xl:py-9">
      <h1 className={titleStyle()}>{title}</h1>
      {image ? (
        <NextImage
          alt={image.altText || title}
          className="aspect-video w-full object-cover object-center"
          width={928}
          height={522}
          src={image.url}
          sizes="(max-width: 1024w) 100vw, 928w"
        />
      ) : null}
      <Prose body={contentHtml} />
    </article>
  );
}
