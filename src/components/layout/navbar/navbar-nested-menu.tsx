"use client";

import { useMemo, useState } from "react";
import { MenuItem } from "@/__generated__/graphql";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { NavbarItem } from "@nextui-org/navbar";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export default function NavbarNestedMenu({ menu }: { menu: MenuItem }) {
  const [visible, setVisible] = useState<boolean>(false);

  //   case 1, render vertically when there is no child in children.
  //   case 2, render horizontally when there is at least one child in children.
  //   use grid 3 cols, if there is case 2
  const hasSecondLevelMenu = useMemo(
    () =>
      menu.items ? menu.items.some((child) => child.items?.length) : false,
    [menu],
  );

  return (
    <NavbarItem
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Button
        size="lg"
        disableAnimation
        disableRipple
        radius="sm"
        className="gap-2 bg-transparent p-0 px-0 text-foreground antialiased data-[hover=true]:bg-transparent"
        endContent={<ChevronDownIcon className="size-4" />}
        variant="light"
        {...(menu.url === "#" ? {} : { href: menu.url, as: Link })}
      >
        {menu.title}
      </Button>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={cn(
              "absolute top-[calc(100%)] z-50 w-max max-w-lg rounded-small border border-default-200 bg-background p-6 shadow-sm",
              hasSecondLevelMenu
                ? "flex flex-wrap gap-9 *:flex-1"
                : "flex flex-col gap-3",
            )}
          >
            {menu.items?.map((child) => (
              <div className="flex flex-col" key={child.url}>
                {/* title */}
                {child.url === "#" ? (
                  <p className={cn(child.items && "font-semibold")}>
                    {child.title}
                  </p>
                ) : (
                  <Link href={child.url} className="font-semibold">
                    {child.title}
                  </Link>
                )}

                <ul className="mt-1">
                  {child.items?.map((children) => (
                    <li key={children.url}>
                      <Link href={children.url}>{children.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </NavbarItem>
  );
}
