"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Chip } from "@nextui-org/chip";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const toggleBreakpoint = 150;

export default function ProductDescription({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [height, setHeight] = useState<number>();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setHeight(ref.current?.scrollHeight);
  }, []);

  function toggleShowMore() {
    setShowMore(!showMore);
  }

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        layout
        ref={ref}
        initial={{
          height: toggleBreakpoint,
        }}
        animate={{
          height: showMore ? "auto" : toggleBreakpoint,
        }}
        className={cn(
          "prose overflow-hidden font-mono leading-relaxed",
          className,
        )}
      >
        {parse(html)}
      </motion.div>
      {height && height > toggleBreakpoint ? (
        <div className="flex items-center">
          <hr
            className="h-divider w-full grow border-none bg-divider"
            role="separator"
          />
          <Chip
            variant="flat"
            classNames={{
              base: "cursor-pointer",
              content: "select-none",
            }}
            endContent={
              <ChevronDownIcon
                className={cn(
                  "size-4 transition-transform duration-700",
                  showMore && "rotate-180",
                )}
              />
            }
            onClick={toggleShowMore}
          >
            Show {showMore ? "Less" : "More"}
          </Chip>
          <hr
            className="h-divider w-full grow border-none bg-divider"
            role="separator"
          />
        </div>
      ) : null}
    </div>
  );
}
