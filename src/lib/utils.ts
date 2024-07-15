import { ReadonlyURLSearchParams } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
