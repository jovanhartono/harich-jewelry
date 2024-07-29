import NextImage from "next/image";
import NextLink from "next/link";
import WordMark from "@/../public/wordmark.png";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { MailIcon } from "@nextui-org/shared-icons";
import dayjs from "dayjs";

import { InstagramIcon, TiktokIcon, WhatsappIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { getMenu } from "@/lib/shopify";

export default async function Footer() {
  const menus = await getMenu("footer");

  return (
    <footer className="flex w-full flex-col bg-cream text-primary">
      <div className="container grid gap-6 py-6 lg:grid-cols-3 lg:gap-12 lg:py-12">
        <div className="flex flex-col gap-3">
          <NextImage
            src={WordMark}
            alt={`${siteConfig.name} Footer Logo`}
            className="w-32"
            sizes="20vw"
          />
          <p className="opacity-70">
            {siteConfig.brand} is an online platform of luxury fashion products
            that focuses on providing 100% authentic branded collections
            supported by Entrupy.
          </p>
          <ul
            className="mt-3 flex items-center gap-6 text-primary"
            aria-label={"Social Icons"}
          >
            <li>
              <Link
                aria-label="Instagram"
                isExternal
                href={siteConfig.links.instagram}
              >
                <InstagramIcon />
              </Link>
            </li>
            <li>
              <Link
                aria-label="WhatsApp"
                isExternal
                href={siteConfig.links.whatsapp}
              >
                <WhatsappIcon />
              </Link>
            </li>
            <li>
              <Link
                aria-label="Tiktok"
                isExternal
                href={siteConfig.links.tiktok}
              >
                <TiktokIcon />
              </Link>
            </li>
          </ul>
        </div>
        <nav className="grid grid-cols-2">
          {menus.map((menu) => (
            <div key={menu.title} className="flex flex-col gap-6">
              <NextLink href={menu.url} className="font-medium text-primary">
                {menu.title}
              </NextLink>
              {menu.items ? (
                <ul className="flex flex-col gap-1.5">
                  {menu.items.map((child) => (
                    <li key={child.title}>
                      <NextLink
                        className="text-primary opacity-70"
                        href={child.url}
                      >
                        {child.title}
                      </NextLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </nav>
        <Card className="bg-default-50" shadow="none">
          <CardHeader as="dl" className="flex flex-col items-start">
            <dt className="text-lg font-medium">
              Subscribe for Latest News/Promotions
            </dt>
            <dd className="text-sm text-default-500">
              Receive special news, promotions, and many more from us straight
              to your email!
            </dd>
          </CardHeader>
          <CardBody>
            <Input
              placeholder={"Type Your Email Here"}
              startContent={<MailIcon />}
            />
          </CardBody>
          <CardFooter>
            <Button color="primary" fullWidth>
              Subscribe
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-wrap justify-center whitespace-nowrap border-t border-t-default-300 bg-cream py-4 text-primary/70">
        © Copyright {dayjs().year()} &nbsp;
        <Link href={siteConfig.url} className="text-inherit">
          {siteConfig.company}
        </Link>
        , All Rights Reserved.
      </div>
    </footer>
  );
}
