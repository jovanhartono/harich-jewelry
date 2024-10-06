"use client";

import { WhatsappIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

export default function FloatingWhatsapp() {
  return (
    <a
      target="_blank"
      rel="noreferrer noopener"
      href={siteConfig.links.whatsapp}
      className="fixed bottom-4 end-4 z-40 flex size-14 rounded-full bg-[#25D366]"
    >
      <WhatsappIcon className="m-auto size-8 text-white" />
    </a>
  );
}
