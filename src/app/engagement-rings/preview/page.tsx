import {
  RingsOverviewLine,
  RingsOverviewSummary,
} from "@/app/engagement-rings/rings-overview";

import { title } from "@/components/primitives";

export default function EngagementRingsPreviewPage() {
  return (
    <div className="container flex flex-col gap-6 py-12">
      <h1 className={title({ size: "sm" })}>Rings Overview</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <RingsOverviewLine />
        <RingsOverviewSummary />
      </div>
    </div>
  );
}
