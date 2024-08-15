import { useMemo } from "react";
import {
  ProductFragment,
  ProductVariantFragment,
} from "@/__generated__/graphql";
import { useIsClient, useLocalStorage } from "@uidotdev/usehooks";

import { LOCAL_STORAGE_KEYS } from "@/lib/constant";

interface SelectedValue {
  product: ProductFragment;
  selectedVariant: ProductVariantFragment;
}

export function useProductLocalStorage() {
  const isClient = useIsClient();
  const [stone, setStone] = useLocalStorage<SelectedValue | null>(
    LOCAL_STORAGE_KEYS.Stone,
    null,
  );
  const [settings, setSettings] = useLocalStorage<SelectedValue | null>(
    LOCAL_STORAGE_KEYS.Setting,
    null,
  );

  return useMemo(
    () => ({
      settings,
      stone,
      loading: !isClient,
      setStone,
      setSettings,
    }),
    [settings, stone, isClient],
  );
}
