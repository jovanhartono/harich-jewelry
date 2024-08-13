import { Skeleton } from "@nextui-org/skeleton";

export default function ProductGridSkeleton() {
  return (
    <div className="@container">
      <div className="grid grid-cols-2 gap-4 @xl:grid-cols-3 @4xl:grid-cols-4 md:gap-3">
        {Array(12)
          .fill(0)
          .map((_, index) => (
            <Skeleton
              key={index}
              className="aspect-[1/1.2] rounded-none bg-default-50"
            />
          ))}
      </div>
    </div>
  );
}
