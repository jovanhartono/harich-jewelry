import NextLink from "next/link";
import { ProductFragment } from "@/__generated__/graphql";
import { Image } from "@nextui-org/image";
import { button } from "@nextui-org/react";

import { cn } from "@/lib/utils";

export const RingShapeList = ({
  ringShapeReference,
  paramsHandle,
}: {
  ringShapeReference: Array<
    ProductFragment & { shape: { label: string; svgUrl: string } }
  >;
  paramsHandle: string;
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-semibold">Center Stone</p>
      <ul className="flex flex-wrap gap-3">
        {ringShapeReference.map((product) => (
          <li
            key={product.id}
            className={cn(
              button({
                color: "primary",
                radius: "sm",
                variant: product.handle === paramsHandle ? "solid" : "light",
                className: "h-max basis-28 text-black",
              }),
            )}
          >
            <NextLink href={`/product/${product.handle}`}>
              <figure className="flex flex-col items-center justify-center p-3">
                <Image
                  className="mb-1 size-16 brightness-0"
                  src={product.shape.svgUrl}
                  alt={product.title}
                />
                <figcaption className="text-balance text-center font-mono">
                  {product.shape.label}
                </figcaption>
              </figure>
            </NextLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
