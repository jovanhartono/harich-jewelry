import NextImage from "next/image";
import { ArticleFragment } from "@/__generated__/graphql";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

export const ArticleCard = ({ article }: { article: ArticleFragment }) => {
  return (
    <Card as="figure" radius="none" shadow="none">
      <Image
        as={NextImage}
        radius="none"
        classNames={{
          img: "object-cover object-center w-full h-full",
          wrapper: "!max-w-none relative aspect-square",
        }}
        fill
        alt={article.image?.altText || article.title}
        src={article.image?.url}
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
