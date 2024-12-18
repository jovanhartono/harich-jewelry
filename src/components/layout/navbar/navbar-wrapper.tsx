"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar as NextUINavbar } from "@nextui-org/navbar";

export const NavbarWrapper = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <NextUINavbar
      maxWidth="full"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      height="5rem"
      id="harich-header"
      isBlurred={false}
      classNames={{
        base: "z-50 bg-background",
        wrapper: "w-full bg-background z-50 px-0",
      }}
    >
      <div className="container relative z-50 flex h-[var(--navbar-height)] w-full max-w-full flex-row flex-nowrap items-center justify-between gap-4 border-b border-b-default-500 bg-background">
        {children}
      </div>
    </NextUINavbar>
  );
};
