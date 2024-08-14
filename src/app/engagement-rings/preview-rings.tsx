"use client";

import { memo, useEffect, useState } from "react";
import {
  ProductFragment,
  ProductVariantFragment,
} from "@/__generated__/graphql";

import { LOCAL_STORAGE_KEYS } from "@/lib/constant";

interface SelectedValue {
  product: ProductFragment;
  selectedVariant: ProductVariantFragment;
}

export const PreviewRings = memo(function PreviewRings() {
  const [settingsJSON, setSettingsJSON] = useState<SelectedValue>();
  const [stone, setStone] = useState<SelectedValue>();

  useEffect(() => {
    const setting = localStorage.getItem(LOCAL_STORAGE_KEYS.Setting);
    const stone = localStorage.getItem(LOCAL_STORAGE_KEYS.Stone);

    setting && setSettingsJSON(JSON.parse(setting));
    stone && setStone(JSON.parse(stone));
  }, []);

  return (
    <div>
      <p>{settingsJSON?.product.title}</p>
      <p>{stone?.product.title}</p>
    </div>
  );
});
