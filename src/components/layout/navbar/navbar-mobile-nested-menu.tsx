"use client";

import { MenuItem } from "@/__generated__/graphql";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Link } from "@nextui-org/link";

export default function NavbarMobileNestedMenu({ menu }: { menu: MenuItem }) {
  return (
    <Accordion
      className="px-0"
      itemClasses={{
        base: "py-0",
        trigger: "py-0",
        content: "pl-4",
      }}
    >
      <AccordionItem title={menu.title}>
        <Accordion
          selectionMode="multiple"
          className="overflow-hidden px-0"
          itemClasses={{
            content: "pl-4",
            title: "text-base",
          }}
        >
          {menu.items?.map((child) => (
            <AccordionItem
              textValue={child.title}
              key={child.id}
              title={
                child.url === "#" ? (
                  child.title
                ) : (
                  <Link color="foreground" href={child.url}>
                    {child.title}
                  </Link>
                )
              }
            >
              {child.items.length ? (
                <ul>
                  {child.items.map((grandChild) => (
                    <li key={grandChild.id}>
                      <Link href={grandChild.url} color="foreground">
                        {grandChild.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                ""
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </AccordionItem>
    </Accordion>
  );
}
