import type { Metadata } from "next";
import NextLink from "next/link";
import { ArticleFragment } from "@/__generated__/graphql";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

import { title as titleStyle } from "@/components/primitives";
import { getBlog, getBlogs } from "@/lib/shopify";
import { generateSrcSet } from "@/lib/utils";

export const revalidate = 30;
export const dynamicParams = true;
export async function generateStaticParams() {
  const blogs = await getBlogs();

  return blogs.map(({ handle }) => ({ blog: handle }));
}

export async function generateMetadata({
  params,
}: {
  params: { blog: string };
}): Promise<Metadata> {
  const { title, seo } = await getBlog(params.blog);

  return {
    title: seo?.title || title,
    description: seo?.description,
  };
}

const ArticleCard = ({ article }: { article: ArticleFragment }) => {
  return (
    <Card as="figure" radius="none" shadow="none">
      <Image
        radius="none"
        classNames={{
          img: "aspect-video md:aspect-square object-cover object-center",
        }}
        alt={article.image?.altText || article.title}
        src={article.image?.url}
        srcSet={article.image?.url ? generateSrcSet(article.image?.url) : ""}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
      <CardBody as="figcaption" className="px-0">
        <h2
          aria-label="article title"
          className="line-clamp-1 text-lg font-medium"
          title={article.title}
        >
          {article.title}
        </h2>
        <p className="line-clamp-3 text-default-500">{article.excerpt}</p>
      </CardBody>
    </Card>
  );
};

export default async function BlogPage({
  params,
}: {
  params: { blog: string };
}) {
  const { title, articles, handle, seo } = await getBlog(params.blog);

  return (
    <div className="container flex flex-col py-6 xl:py-9">
      <h1 className={titleStyle({ size: "sm" })}>{title}</h1>
      <p className="mb-9 mt-1.5 text-balance text-default-700">
        {seo?.description}
      </p>
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {articles.map((article) => (
          <NextLink
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
