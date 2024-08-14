"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ProductFragment,
  ProductVariantFragment,
} from "@/__generated__/graphql";

import { LOCAL_STORAGE_KEYS } from "@/lib/constant";

interface SelectedValue {
  product: ProductFragment;
  selectedVariant: ProductVariantFragment;
}

interface RingBuilderContextType {
  settings?: SelectedValue;
  stone?: SelectedValue;
}

const RingBuilderContext = createContext<RingBuilderContextType | undefined>(
  undefined,
);

export function RingBuilderProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SelectedValue>();
  const [stone, setStone] = useState<SelectedValue>();

  useEffect(() => {
    const setting = localStorage.getItem(LOCAL_STORAGE_KEYS.Setting);
    const stone = localStorage.getItem(LOCAL_STORAGE_KEYS.Stone);

    setting && setSettings(JSON.parse(setting));
    stone && setStone(JSON.parse(stone));
  }, []);

  const value = useMemo(
    () => ({
      settings,
      stone,
    }),
    [settings, stone],
  );

  return (
    <RingBuilderContext.Provider value={value}>
      {children}
    </RingBuilderContext.Provider>
  );
}

export function useRingBuilder() {
  const context = useContext(RingBuilderContext);

  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }

  return context;
}
