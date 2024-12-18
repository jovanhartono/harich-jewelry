"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@nextui-org/button";

import { siteConfig } from "@/config/site";

export const ProductWhatsappOrder = memo(function ProductWhatsappOrder({
  productTitle,
}: {
  productTitle: string;
}) {
  const pathname = usePathname();

  return (
    <div className="bottom-float-wrapper">
      <Button
        rel="noopener noreferrer"
        target="_blank"
        as={Link}
        color="primary"
        size="lg"
        fullWidth
        radius="sm"
        href={`https://api.whatsapp.com/send?phone=${siteConfig.phone}&text=Hello Harich, i want to ask about%0A${productTitle}%0A${siteConfig.url}/${pathname}`}
      >
        Order via WhatsApp
      </Button>
    </div>
  );
});
