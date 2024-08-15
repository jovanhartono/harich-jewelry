import { useEffect, useMemo, useState } from "react";
import {
  ProductFragment,
  ProductVariantFragment,
} from "@/__generated__/graphql";
import { useIsClient } from "@uidotdev/usehooks";

import { LOCAL_STORAGE_KEYS } from "@/lib/constant";

interface SelectedValue {
  product: ProductFragment;
  selectedVariant: ProductVariantFragment;
}

export function useProductLocalStorage() {
  const isClient = useIsClient();
  const [settings, setSettings] = useState<SelectedValue>();
  const [stone, setStone] = useState<SelectedValue>();

  useEffect(() => {
    const setting = localStorage.getItem(LOCAL_STORAGE_KEYS.Setting);
    const stone = localStorage.getItem(LOCAL_STORAGE_KEYS.Stone);

    setting && setSettings(JSON.parse(setting));
    stone && setStone(JSON.parse(stone));
  }, [
    localStorage.getItem(LOCAL_STORAGE_KEYS.Setting),
    localStorage.getItem(LOCAL_STORAGE_KEYS.Stone),
  ]);

  function setStoneToLocalStorage(args: SelectedValue) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.Stone, JSON.stringify(args));
  }

  function deleteStoneFromLocalStorage() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.Stone);
  }

  const value = useMemo(
    () => ({
      settings,
      stone,
      loading: !isClient,
      setStoneToLocalStorage,
      deleteStoneFromLocalStorage,
    }),
    [settings, stone, isClient],
  );

  return value;
}
