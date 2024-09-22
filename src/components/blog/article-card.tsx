import { ArticleFragment } from "@/__generated__/graphql";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

import { generateSrcSet } from "@/lib/utils";

export const ArticleCard = ({ article }: { article: ArticleFragment }) => {
  return (
    <Card as="figure" radius="none" shadow="none">
      <Image
        radius="none"
        classNames={{
          img: "aspect-square object-cover object-center w-full",
          wrapper: "!max-w-none",
        }}
        alt={article.image?.altText || article.title}
        src={article.image?.url}
        srcSet={article.image?.url ? generateSrcSet(article.image?.url) : ""}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw"
      />
      <CardBody as="figcaption" className="gap-2 px-0 py-4">
        <h2
          aria-label="article title"
          className="text-2xl font-medium tracking-tight"
          title={article.title}
        >
          {article.title}
        </h2>
        <p className="font-light text-default-600">{article.excerpt}</p>
      </CardBody>
    </Card>
  );
};
