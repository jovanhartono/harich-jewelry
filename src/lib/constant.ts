import {
  ProductCollectionSortKeys,
  SearchSortKeys,
} from "@/__generated__/graphql";

export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
};

export const PRODUCT_TYPES = {
  Stone: "Stone",
  Setting: "Setting",
};

export const LIMITED_STOCK_THRESHOLD = 5;

export const FILTER_ID = {
  band_type: "filter.p.m.ring.band_type",
  shape: "filter.p.m.stone.shape",
  setting_style: "filter.p.m.ring.setting_style",
};

export const LOCAL_STORAGE_KEYS: Record<keyof typeof PRODUCT_TYPES, string> = {
  Setting: "harich.selected_settings",
  Stone: "harich.selected_stone",
};

export const CART_LINE_ATTRIBUTE_KEYS = {
  ENGRAVING: "Engraving",
  SIZE: "Size",
};

export const COLLECTION_HANDLE: Record<"setting" | "stone", string> = {
  setting: "engagement-rings",
  stone: "diamonds",
};

export const DEFAULT_TITLE_OPTION = "Default Title";

export interface FilterItem {
  title: string;
  slug: string;
  reverse: boolean;
}

export interface SearchSortFilterItem extends FilterItem {
  sortKey: SearchSortKeys;
}

export const DEFAULT_SEARCH_SORT_OPTION: SearchSortFilterItem = {
  title: "Relevance",
  slug: "relevance",
  sortKey: SearchSortKeys.Relevance,
  reverse: false,
};

export const SEARCH_SORT_OPTIONS: SearchSortFilterItem[] = [
  DEFAULT_SEARCH_SORT_OPTION,
  {
    title: "Price: Low to high",
    slug: "price-asc",
    sortKey: SearchSortKeys.Price,
    reverse: false,
  },
  {
    title: "Price: High to low",
    slug: "price-desc",
    sortKey: SearchSortKeys.Price,
    reverse: true,
  },
];

export interface ProductCollectionSortFilterItem extends FilterItem {
  sortKey: ProductCollectionSortKeys;
}

export const DEFAULT_SORT_OPTION: ProductCollectionSortFilterItem = {
  title: "Relevance",
  slug: "relevance",
  sortKey: ProductCollectionSortKeys.Relevance,
  reverse: false,
};

export const SORT_OPTIONS: ProductCollectionSortFilterItem[] = [
  DEFAULT_SORT_OPTION,
  {
    title: "Trending",
    slug: "trending-desc",
    sortKey: ProductCollectionSortKeys.BestSelling,
    reverse: false,
  },
  {
    title: "Latest arrivals",
    slug: "latest-desc",
    sortKey: ProductCollectionSortKeys.Created,
    reverse: true,
  },
  {
    title: "Price: Low to high",
    slug: "price-asc",
    sortKey: ProductCollectionSortKeys.Price,
    reverse: false,
  },
  {
    title: "Price: High to low",
    slug: "price-desc",
    sortKey: ProductCollectionSortKeys.Price,
    reverse: true,
  },
];

export const COOKIES = {
  CART: "cart-id",
};

export const RING_SIZE_OPTIONS = [
  { sizeHK: 6, sizeUS: 3, diameter: 14.1 },
  { sizeHK: 7, sizeUS: 3.25, diameter: 14.3 },
  { sizeHK: 8, sizeUS: 3.75, diameter: 14.7 },
  { sizeHK: 9, sizeUS: 4, diameter: 14.9 },
  { sizeHK: 10, sizeUS: 4.5, diameter: 15.3 },
  { sizeHK: 11, sizeUS: 5, diameter: 15.7 },
  { sizeHK: 12, sizeUS: 5.5, diameter: 16.1 },
  { sizeHK: 13, sizeUS: 6, diameter: 16.5 },
  { sizeHK: 14, sizeUS: 6.25, diameter: 16.7 },
  { sizeHK: 15, sizeUS: 6.75, diameter: 17.1 },
  { sizeHK: 16, sizeUS: 7, diameter: 17.3 },
  { sizeHK: 17, sizeUS: 7.5, diameter: 17.7 },
  { sizeHK: 18, sizeUS: 8, diameter: 18.2 },
  { sizeHK: 19, sizeUS: 8.5, diameter: 18.5 },
  { sizeHK: 20, sizeUS: 9.75, diameter: 18.8 },
  { sizeHK: 21, sizeUS: 9.25, diameter: 19.1 },
  { sizeHK: 22, sizeUS: 9.5, diameter: 19.4 },
  { sizeHK: 23, sizeUS: 10, diameter: 19.8 },
  { sizeHK: 24, sizeUS: 10.5, diameter: 20.2 },
  { sizeHK: 25, sizeUS: 11, diameter: 20.6 },
  { sizeHK: 26, sizeUS: 11.5, diameter: 21.0 },
  { sizeHK: 27, sizeUS: 12, diameter: 21.2 },
  { sizeHK: 28, sizeUS: 12.25, diameter: 21.6 },
  { sizeHK: 29, sizeUS: 12.5, diameter: 22.0 },
];
