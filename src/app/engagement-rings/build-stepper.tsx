import NextLink from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const steps = [
  {
    key: "setting",
    label: "Choose Setting",
    href: "/engagement-rings/setting",
  },
  {
    key: "stone",
    label: "Choose Diamond",
    href: "/engagement-rings/stone",
  },
  {
    key: "preview",
    label: "Add to Cart",
    href: "/engagement-rings/preview",
  },
];

export default function BuildStepper({ type }: { type: "setting" | "stone" }) {
  return (
    <div className="container mx-auto w-full max-w-screen-lg">
      <ul className="flex items-center justify-center gap-6 *:flex-1">
        {steps.map((step, idx) => (
          <li
            key={step.key}
            className="flex h-20 items-center justify-between gap-3"
          >
            <NextLink
              href={step.href}
              className={cn(
                "flex grow items-center justify-center self-stretch rounded-large",
                {
                  "bg-primary": step.key === type,
                },
              )}
            >
              <h2 className="text-xl">{step.label}</h2>
            </NextLink>

            {idx < 2 ? <ArrowRightIcon className="size-4" /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
