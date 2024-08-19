import { GetStoneCollectionQuery } from "@/__generated__/graphql";

import { getCart } from "@/lib/shopify";

export type StoneColor = "D" | "E" | "F" | "G";
export type StoneClarity = "VS1" | "VS2" | "VVS1" | "VVS2";
export interface StoneSpecifications {
  cut: string;
  color: StoneColor;
  clarity: StoneClarity;
  carat: string;
}
export interface MetaObjectUrl {
  text: string;
  url: string;
}

export type Edge<T> = {
  node: T;
};

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type GetCartReturn = ReturnType<typeof getCart>;
export type GetAwaitedCartReturn = Awaited<GetCartReturn>;
export type StoneCollectionProduct = NonNullable<
  GetStoneCollectionQuery["collection"]
>["products"]["edges"][0]["node"];
