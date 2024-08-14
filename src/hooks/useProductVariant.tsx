import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  ProductFragment,
  ProductVariantFragment,
} from "@/__generated__/graphql";

import { formatRupiah } from "@/lib/utils";

type Combination = {
  id: string;
  availableForSale: boolean;
  price: string;
  [key: string]: string | boolean;
};

export default function useProductVariant({
  options,
  variants,
}: {
  options: ProductFragment["options"];
  variants: ProductVariantFragment[];
}) {
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    price: formatRupiah(parseFloat(variant.price.amount)),
    availableForSale: variant.availableForSale,
    // Adds key / value pairs for each variant (i.e. "color": "Black" and "size": 'M").
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {},
    ),
  }));

  const availableVariant = useMemo(
    () => variants.find((variant) => variant.availableForSale),
    [variants],
  );

  const isOptionAvailableForSale = useCallback(
    (name: string, value: string) => {
      // Base option params on current params, so we can preserve any other param state in the url.
      const optionSearchParams = new URLSearchParams(searchParams.toString());
      optionSearchParams.set(name.toLowerCase(), value);

      availableVariant?.selectedOptions.forEach((option) => {
        const isOptionAlreadyExistInUrl = optionSearchParams.get(
          option.name.toLowerCase(),
        );

        if (!isOptionAlreadyExistInUrl) {
          // Only set params when there is no key value in url
          optionSearchParams.set(option.name.toLowerCase(), option.value);
        }
      });

      // In order to determine if an option is available for sale, we need to:
      //
      // 1. Filter out all other param state
      // 2. Filter out invalid options
      // 3. Check if the option combination is available for sale
      //
      // This is the "magic" that will cross-check possible variant combinations and preemptively
      // disable combinations that are not available. For example, if the color gray is only available in size medium,
      // then all other sizes should be disabled.
      const filtered = Array.from(optionSearchParams.entries()).filter(
        ([key, value]) =>
          options.find(
            (option) =>
              option.name.toLowerCase() === key &&
              option.values.includes(value),
          ),
      );

      return !!combinations.find((combination) =>
        filtered.every(
          ([key, value]) =>
            combination[key] === value && combination.availableForSale,
        ),
      )?.availableForSale;
    },
    [availableVariant?.selectedOptions, combinations, options, searchParams],
  );

  const selectedVariant = useMemo(() => {
    const optionSearchParams = new URLSearchParams(searchParams.toString());

    // All product variants are Out of stock
    if (!availableVariant) {
      return;
    }

    availableVariant.selectedOptions.forEach((option) => {
      const isOptionAlreadyExistInUrl = optionSearchParams.get(
        option.name.toLowerCase(),
      );

      if (!isOptionAlreadyExistInUrl) {
        // Only set params when there is no key value in url
        optionSearchParams.set(option.name.toLowerCase(), option.value);
      }
    });

    // checks whether the url params has already contained a key-value pair of an option
    const variant = variants.find((variant: ProductVariantFragment) =>
      variant.selectedOptions.every(
        (option) =>
          option.value === optionSearchParams.get(option.name.toLowerCase()),
      ),
    );

    // the url state already contains an option
    if (variant) {
      return variant;
    }

    // the url does not contain any of the option value
    return availableVariant;
  }, [availableVariant, searchParams, variants]);

  return {
    hasNoOptionsOrJustOneOption,
    isOptionAvailableForSale,
    selectedVariant,
  };
}
