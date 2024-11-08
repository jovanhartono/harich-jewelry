import NextImage, { getImageProps } from "next/image";
import { MediaImage } from "@/__generated__/graphql";

export default function CollectionHero({
  desktop_file,
  mobile_file,
}: {
  desktop_file?: MediaImage | null;
  mobile_file?: MediaImage | null;
}) {
  const isDesktopImage = desktop_file?.__typename === "MediaImage";
  const isMobileImage = mobile_file?.__typename === "MediaImage";

  const {
    props: { srcSet: desktop },
  } = getImageProps({
    src: desktop_file?.image?.url,
    sizes: "100vw",
    width: 1440,
    height: 400,
    priority: true,
    alt: desktop_file?.image?.url || "Collection Banner",
  });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    src: mobile_file?.image?.url,
    sizes: "100vw",
    width: 767,
    height: 400,
    priority: true,
    alt: mobile_file?.image?.url || "Collection Banner",
  });

  if (isDesktopImage || isMobileImage) {
    return (
      <picture className="h-full w-full">
        <source media="(max-width: 767px)" srcSet={mobile} />
        <source media="(min-width: 768px)" srcSet={desktop} />
        <NextImage
          width={1440}
          height={400}
          className="z-0 h-[400px] w-full object-cover object-center"
          src={
            (isDesktopImage ? desktop_file.image?.url : undefined) ||
            (isMobileImage ? mobile_file.image?.url : undefined)
          }
          alt="Engagement Rings Hero Image"
          sizes="100vw"
        />
      </picture>
    );
  }

  // Fallback return statement if none of the above conditions are met
  return null;
}
