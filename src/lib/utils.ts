import { ReadonlyURLSearchParams } from "next/navigation";
import { GetProductByHandleQuery } from "@/__generated__/graphql";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { StoneSpecifications } from "@/lib/type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export function formatRupiah(number: number | null | undefined): string {
  if (number === null || number === undefined) return "";

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  return formatter.format(number);
}

export function stringToNumber(
  input: string | null | undefined,
): number | undefined {
  if (input == null) {
    // If input is null or undefined, return null
    return;
  }

  const parsedNumber = Number(input);

  if (!isFinite(parsedNumber)) {
    // If parsing fails, return null
    return;
  }

  return parsedNumber;
}

export function convertParamsToArray(params?: string | string[]) {
  if (!params) {
    return [];
  }

  return Array.isArray(params) ? params : [params];
}

export function handleProductFilter(searchParams: ReadonlyURLSearchParams) {
  const min = searchParams.get("min");
  const max = searchParams.get("max");

  const type = searchParams.getAll("type");
  const size = searchParams.getAll("size");
  const color = searchParams.getAll("color");
  const vendor = searchParams.getAll("vendor");
  const availability = searchParams.getAll("availability");

  return [
    ...convertParamsToArray(type).map((productType) => ({
      productType,
    })),
    ...convertParamsToArray(vendor).map((productVendor) => ({
      productVendor,
    })),
    ...convertParamsToArray(availability).map((available) => ({
      available: available === "true",
    })),
    ...convertParamsToArray(size).map((size) => ({
      variantOption: {
        name: "size",
        value: size,
      },
    })),
    ...convertParamsToArray(color).map((color) => ({
      variantOption: {
        name: "color",
        value: color,
      },
    })),
    {
      price: {
        min: stringToNumber(min),
        max: stringToNumber(max),
      },
    },
  ];
}

export function generateSrcSet(
  url: string,
  widths: string[] = ["375", "475", "768", "1024", "1440"],
) {
  const urlObject = new URL(url);

  return widths
    .map((width) => {
      urlObject.searchParams.set("width", width);

      return `${urlObject.toString()} ${width}w`;
    })
    .join(", ");
}

export const handleProductQuery = (data: GetProductByHandleQuery) => {
  if (!data.product) return;

  const { product } = data;

  const shapeReference =
    product.shapeReference?.references?.edges
      .map(({ node }) => {
        if (
          node.__typename === "Product" &&
          node.cut?.reference?.__typename === "Metaobject"
        ) {
          const shapeRef = node.cut?.reference;

          return {
            ...node,
            shape: {
              label: shapeRef.label?.value || "",
              svgUrl:
                shapeRef.svg?.reference?.__typename === "MediaImage"
                  ? shapeRef.svg.reference.image?.url
                  : undefined,
            },
          };
        }

        return null;
      })
      .filter((edge) => edge !== null) || [];

  const stoneCertificate =
    product.stoneCertificate?.reference?.__typename === "MediaImage"
      ? product.stoneCertificate?.reference?.image
      : undefined;

  const stoneSpecifications = product.stoneSpecifications.reduce(
    (acc, curr) => {
      const key = curr?.key as keyof StoneSpecifications;
      if (!acc[key]) {
        acc[key] = curr?.value as never;
      }

      return acc;
    },
    {} as StoneSpecifications,
  );

  return {
    ...product,
    variants: product.variants.edges.map((edge) => edge.node) || [],
    shapeReference,
    stoneCertificate,
    stoneSpecifications,
  };
};
