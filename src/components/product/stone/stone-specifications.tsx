import { memo } from "react";

import { cn } from "@/lib/utils";

export const StoneSpecifications = memo(function StoneSpecifications({
  specifications,
  className,
}: {
  specifications: Array<{ key: string; value: string } | null>;
  className?: string;
}) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3", className)}>
      {specifications.map((specification) =>
        specification ? (
          <li key={specification.key}>
            <p className="text-xs capitalize text-default-700">
              {specification.key}
            </p>
            <strong className="text-sm font-medium">
              {specification.value}
            </strong>
          </li>
        ) : null,
      )}
    </ul>
  );
});
