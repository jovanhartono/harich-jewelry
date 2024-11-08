import type { Metadata } from "next";
import NextLink from "next/link";

import { ArticleCard } from "@/components/blog/article-card";
import { title as titleStyle } from "@/components/primitives";
import { getBlog, getBlogs } from "@/lib/shopify";

export const revalidate = 30;
export const dynamicParams = true;
export async function generateStaticParams() {
  const blogs = await getBlogs();

  return blogs.map(({ handle }) => ({ blog: handle }));
}

export async function generateMetadata(props: {
  params: Promise<{ blog: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { title, seo } = await getBlog(params.blog);

  return {
    title: seo?.title || title,
    description: seo?.description,
  };
}

export default async function BlogPage(props: {
  params: Promise<{ blog: string }>;
}) {
  const params = await props.params;
  const { title, articles, handle, seo } = await getBlog(params.blog);

  return (
    <div className="container flex flex-col py-6 xl:py-9">
      <h1 className={titleStyle()}>{title}</h1>
      <p className="mb-9 mt-1.5 text-balance text-default-700">
        {seo?.description}
      </p>
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <NextLink
            prefetch
            key={article.id}
            href={`/blogs/${handle}/${article.handle}`}
            className="block h-full p-1"
          >
            <ArticleCard article={article} />
          </NextLink>
        ))}
      </section>
    </div>
  );
}
