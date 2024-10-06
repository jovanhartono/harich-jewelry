import NextImage from "next/image";
import { ArticleFragment } from "@/__generated__/graphql";
import { Card, CardBody } from "@nextui-org/card";

export const ArticleCard = ({ article }: { article: ArticleFragment }) => {
  return (
    <Card as="figure" radius="none" shadow="none">
      <NextImage
        width={500}
        height={500}
        alt={article.image?.altText || article.title}
        src={article.image?.url}
        className="aspect-square object-cover object-center"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
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
