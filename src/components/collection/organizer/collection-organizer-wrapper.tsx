"use client";

import dynamic from "next/dynamic";

const CollectionOrganizer = dynamic(
  () => import("./collection-organizer").then((m) => m.CollectionOrganizer),
  {
    ssr: false,
  },
);

export function CollectionOrganizerWrapper() {
  return <CollectionOrganizer />;
}
