import { ReactNode, Suspense } from "react";
import { Metadata } from "next";
import BuildStepper from "@/app/engagement-rings/build-stepper";
import EngagementRingsHero from "@/app/engagement-rings/engagement-rings-hero";
import { ProductModalProvider } from "@/app/engagement-rings/product-modal-provider";
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
    <ProductModalProvider>
      <RingBuilderProvider>
        <div className="flex flex-col gap-6 pb-12">
          <EngagementRingsHero />
          <Suspense>
            <BuildStepper />
          </Suspense>

          {children}
        </div>
      </RingBuilderProvider>
    </ProductModalProvider>
  );
}
