"use client";

import { Fragment, useState } from "react";
import NextLink from "next/link";
import { MenuItem } from "@/__generated__/graphql";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { NavbarItem } from "@nextui-org/navbar";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export default function NavbarNestedMenu({ menu }: { menu: MenuItem }) {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <NavbarItem
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Button
        size="lg"
        disableAnimation
        disableRipple
        radius="sm"
        className="gap-2 bg-transparent p-0 px-0 font-light text-foreground data-[hover=true]:bg-transparent"
        endContent={<ChevronDownIcon className="size-4" />}
        variant="light"
        {...(menu.url === "#" ? {} : { href: menu.url, as: Link })}
      >
        {menu.title}
      </Button>
      <AnimatePresence>
        {visible && (
          <Fragment>
            <div className="absolute inset-x-0 h-4 bg-transparent"></div>
            <motion.ul
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className={cn(
                "absolute inset-x-0 top-[calc(100%_-_1px)] z-10 border border-default-200 bg-background py-6 shadow-sm",
              )}
            >
              <div className="container flex flex-wrap gap-12">
                {menu.items?.map((child) => (
                  <li className="flex flex-col" key={child.id}>
                    {/* title */}
                    {child.url === "#" ? (
                      <span>{child.title}</span>
                    ) : (
                      <NextLink
                        prefetch
                        href={child.url}
                        className="font-semibold"
                      >
                        {child.title}
                      </NextLink>
                    )}

                    <ul className="mt-2 space-y-1">
                      {child.items?.map((children) => (
                        <li key={children.id}>
                          <NextLink prefetch href={children.url}>
                            {children.title}
                          </NextLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </div>
            </motion.ul>
          </Fragment>
        )}
      </AnimatePresence>
    </NavbarItem>
  );
}
