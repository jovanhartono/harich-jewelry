import { ReactNode, Suspense } from "react";
import { Metadata } from "next";
import BuildStepper from "@/app/engagement-rings/build-stepper";
import { RingBuilderProvider } from "@/app/engagement-rings/ring-builder-provider";

export const metadata: Metadata = {
  title: "Build Engagement Rings",
};

export default function EngagementRingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RingBuilderProvider>
      <div className="flex flex-col gap-6 pb-12">
        <Suspense>
          <BuildStepper />
        </Suspense>

        {children}
      </div>
    </RingBuilderProvider>
  );
}
