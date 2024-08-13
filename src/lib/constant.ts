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
  STONE: "Stone",
  SETTING: "Setting",
};

export const LIMITED_STOCK_THRESHOLD = 5;

export const FILTER_ID = {
  band_type: "filter.p.m.ring.band_type",
  shape: "filter.p.m.stone.shape",
  setting_style: "filter.p.m.ring.setting_style",
};

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
