"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@uidotdev/usehooks";

const CollectionOrganizerDesktop = dynamic(
  () =>
    import(
      "@/components/collection/organizer/desktop/collection-organizer-desktop"
    ).then((m) => m.CollectionOrganizerDesktop),
  {
    loading: () => (
      <div className="sticky top-[80px] z-20 h-16 bg-background" />
    ),
  },
);

const CollectionFilterSorterMobile = dynamic(() =>
  import(
    "@/components/collection/organizer/mobile/collection-filter-sorter-mobile"
  ).then((m) => m.CollectionFilterSorterMobile),
);

export const CollectionOrganizer = () => {
  const isDesktop = useMediaQuery("only screen and (min-width : 768px)");

  return isDesktop ? (
    <CollectionOrganizerDesktop />
  ) : (
    <CollectionFilterSorterMobile />
  );
};
