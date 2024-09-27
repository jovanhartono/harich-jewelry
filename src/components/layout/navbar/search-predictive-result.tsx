import { memo } from "react";
import NextLink from "next/link";
import {
  GetSearchRecommendationQuery,
  GetSearchRecommendationQueryVariables,
} from "@/__generated__/graphql";
import { QueryRef, useReadQuery } from "@apollo/client";
import { SearchIcon } from "@nextui-org/shared-icons";

import ProductCard from "@/components/product/product-card";

export const SearchPredictiveResult = memo(function SearchPredictiveResult({
  onClose,
  queryRef,
}: {
  onClose: () => void;
  queryRef: QueryRef<
    GetSearchRecommendationQuery,
    GetSearchRecommendationQueryVariables
  >;
}) {
  const { data } = useReadQuery(queryRef);

  return (
    <>
      {data.predictiveSearch?.queries.length ? (
        <div>
          <h2 className="mb-1 text-lg font-medium">Suggestions</h2>
          <nav>
            <ul>
              {data.predictiveSearch?.queries.map((query, idx) => (
                <li key={idx} className="my-2">
                  <NextLink
                    href={`/search?q=${query.text}`}
                    onClick={onClose}
                    className="flex gap-2"
                  >
                    <SearchIcon className="size-4 text-default-400" />
                    {query.text}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}

      {data.predictiveSearch?.products.length ? (
        <div className="@container">
          <h2 className="mb-1 text-lg font-medium">Products</h2>
          <ul className="grid grid-cols-2 gap-6 @xl:grid-cols-3">
            {data.predictiveSearch.products.map((product) => (
              <li key={product.id}>
                <ProductCard
                  cardProps={{
                    isPressable: true,
                    onPress: onClose,
                    disableRipple: true,
                  }}
                  product={product}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
});
