"use client";

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useOptimistic,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GetProductByHandleQuery,
  ProductFragment,
  ProductVariantFragment,
} from "@/__generated__/graphql";

import {
  formatRupiah,
  handleProductQuery,
  ProductQueryReshape,
} from "@/lib/utils";

type ProductState = {
  [key: string]: string;
};

type Combination = {
  id: string;
  availableForSale: boolean;
  price: string;
  [key: string]: string | boolean;
};

type ProductContextType = {
  state: ProductState;
  selectedVariant?: ProductVariantFragment;
  isOptionAvailableForSale: (key: string, value: string) => boolean;
  hasNoOptionsOrJustOneOption: boolean;
  updateOption: (name: string, value: string) => ProductState;
  updateImage: (index: string) => ProductState;
  options: ProductFragment["options"];
  product: Exclude<ProductQueryReshape, undefined>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({
  children,
  product: productProps,
}: {
  children: ReactNode;
  product: Required<GetProductByHandleQuery>["product"];
}) {
  const product = handleProductQuery(productProps)!;
  const { options, variants } = product;

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

  const getInitialState = () => {
    const params: ProductState = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  };

  const [state, setOptimisticState] = useOptimistic(
    getInitialState(),
    (prevState: ProductState, update: ProductState) => ({
      ...prevState,
      ...update,
    }),
  );

  const updateOption = (name: string, value: string) => {
    const newState = { [name]: value };
    setOptimisticState(newState);
    return { ...state, ...newState };
  };

  const updateImage = (index: string) => {
    const newState = { image: index };
    setOptimisticState(newState);
    return { ...state, ...newState };
  };

  const availableVariant = useMemo(
    () => variants.find((variant) => variant.availableForSale),
    [variants],
  );

  const selectedVariant = useMemo(() => {
    // All product variants are Out of stock
    if (!availableVariant) {
      return;
    }

    // checks whether the url params has already contained a key-value pair of an option
    const variant = variants.find((variant) =>
      variant.selectedOptions.every(
        (option) => option.value === state[option.name.toLowerCase()],
      ),
    );

    // the url state already contains an option
    if (variant) {
      return variant;
    }

    // the url does not contain any of the option value, default to the first variant that is available for sale.
    return availableVariant;
  }, [availableVariant, variants, state]);

  const isOptionAvailableForSale = useCallback(
    (optionName: string, optionValue: string) => {
      // Base option params on current params, so we can preserve any other param state in the url.
      const optionSearchParams = {
        ...state,
        [optionName.toLowerCase()]: optionValue,
      };

      // set options to default variant if no search params is present.
      availableVariant?.selectedOptions.forEach((option) => {
        const isOptionAlreadyExistInUrl =
          optionSearchParams[option.name.toLowerCase()];

        if (!isOptionAlreadyExistInUrl) {
          // Only set params when there is no key value in url
          optionSearchParams[option.name.toLowerCase()] = option.value;
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
      const filtered = Object.entries(optionSearchParams).filter(
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
      );
    },
    [availableVariant?.selectedOptions, combinations, options, state],
  );

  const value = useMemo(
    () => ({
      state,
      selectedVariant,
      isOptionAvailableForSale,
      hasNoOptionsOrJustOneOption,
      updateOption,
      updateImage,
      options,
      product,
    }),
    [state, selectedVariant, hasNoOptionsOrJustOneOption, options, product],
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}

export function useUpdateURL() {
  const router = useRouter();

  return (state: ProductState) => {
    const newParams = new URLSearchParams(window.location.search);
    Object.entries(state).forEach(([key, value]) => {
      newParams.set(key, value);
    });
    router.push(`?${newParams.toString()}`, { scroll: false });
  };
}
