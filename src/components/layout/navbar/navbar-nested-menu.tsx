"use client";

import { Fragment, useEffect, useState } from "react";
import NextLink from "next/link";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { NavbarItem } from "@nextui-org/navbar";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { createPortal } from "react-dom";

import type { GetMenuReturnType } from "@/lib/shopify";
import { cn } from "@/lib/utils";

export default function NavbarNestedMenu({
  menu,
}: {
  menu: GetMenuReturnType[0];
}) {
  const [visible, setVisible] = useState<boolean>(false);
  const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHeaderEl(() => document.getElementById("harich-header"));
  }, []);

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
      {headerEl &&
        createPortal(
          <AnimatePresence>
            {visible && (
              <Fragment>
                <div className="absolute inset-x-0 bottom-0 z-50 h-4" />
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  transition={{ bounce: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className={cn(
                    "absolute inset-x-0 top-[calc(100%)] z-0 border border-default-200 bg-background py-6 shadow-sm",
                  )}
                >
                  <ul className="container flex flex-wrap gap-12">
                    {menu.items?.map((child) => (
                      <li className="flex flex-col" key={child.id}>
                        {/* title */}
                        {child.url === "#" ? (
                          <span className="font-medium">{child.title}</span>
                        ) : (
                          <NextLink
                            prefetch
                            href={child.url}
                            className="font-medium"
                          >
                            {child.title}
                          </NextLink>
                        )}

                        <ul className="mt-2 space-y-1">
                          {child.items?.map((children) => (
                            <li key={children.id}>
                              <NextLink
                                prefetch
                                href={children.url}
                                className="text-gray-700 transition-colors hover:text-black"
                              >
                                {children.title}
                              </NextLink>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Fragment>
            )}
          </AnimatePresence>,
          headerEl,
        )}
    </NavbarItem>
  );
}
