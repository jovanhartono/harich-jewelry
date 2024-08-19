import { Image } from "@nextui-org/image";

import { generateSrcSet } from "@/lib/utils";

export default function CollectionHero({
  desktop_file,
  mobile_file,
}: {
  desktop_file: any;
  mobile_file: any;
}) {
  const isDesktopImage = desktop_file?.__typename === "MediaImage";
  const isMobileImage = mobile_file?.__typename === "MediaImage";

  // if (
  //   desktop_file?.__typename === "Video" ||
  //   mobile_file?.__typename === "Video"
  // ) {
  //   const desktopFileIsVideo = desktop_file?.__typename === "Video";
  //   const mobileFileIsVideo = mobile_file?.__typename === "Video";
  //
  //   return (
  //     <>
  //       {mobileFileIsVideo && (
  //         <video
  //           autoPlay
  //           muted
  //           loop
  //           poster={mobile_file?.previewImage?.url}
  //           className="md:hidden"
  //         >
  //           {mobile_file.sources.map((source, idx) => (
  //             <source key={idx} src={source.url} type={source.mimeType} />
  //           ))}
  //         </video>
  //       )}
  //       {desktopFileIsVideo && (
  //         <video
  //           autoPlay
  //           muted
  //           loop
  //           poster={desktop_file?.previewImage?.url}
  //           className="max-md:hidden"
  //         >
  //           {desktop_file.sources.map((source, idx) => (
  //             <source key={idx} src={source.url} type={source.mimeType} />
  //           ))}
  //         </video>
  //       )}
  //     </>
  //   );
  // }

  if (isDesktopImage || isMobileImage) {
    return (
      <picture className="h-full w-full">
        {isMobileImage && (
          <source
            media="(max-width: 767px)"
            srcSet={generateSrcSet(mobile_file.image?.url)}
          />
        )}
        {isDesktopImage && (
          <source
            media="(min-width: 768px)"
            srcSet={generateSrcSet(desktop_file.image?.url)}
          />
        )}
        <Image
          height={400}
          removeWrapper
          className="z-0 w-full object-cover object-center"
          src={
            (isDesktopImage ? desktop_file.image?.url : undefined) ||
            (isMobileImage ? mobile_file.image?.url : undefined)
          }
          alt="Engagement Rings Hero Image"
          sizes="100vw"
          radius="none"
        />
      </picture>
    );
  }

  // Fallback return statement if none of the above conditions are met
  return null;
}
