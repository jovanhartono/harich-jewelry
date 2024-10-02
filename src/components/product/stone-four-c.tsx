"use client";

import { memo, useMemo, useState } from "react";
import NextImage from "next/image";
import { Slider, SliderValue } from "@nextui-org/slider";

import { title } from "@/components/primitives";
import { StoneClarity, StoneColor, StoneSpecifications } from "@/lib/type";
import { cn, reshapeStoneSpecifications } from "@/lib/utils";

const clarities = [
  {
    value: 0,
    label: "VS2",
    description:
      "Minor inclusions that range from difficult to somewhat easy to see are visible to a skilled grader using 10x magnification.",
    src: "https://cdn.shopify.com/s/files/1/0611/4158/1902/files/VS2.png?v=1723136591",
  },
  {
    value: 1,
    label: "VS1",
    description:
      "Small inclusions difficult to see with 10x magnification, and will almost always be invisible to the naked eye.",
    src: "https://cdn.shopify.com/s/files/1/0611/4158/1902/files/VS1.png?v=1723136655",
  },
  {
    value: 2,
    label: "VVS2",
    description:
      "Minute inclusions that range from extremely difficult to very difficult to see are visible to a skilled grader using 10x magnification.",
    src: "https://cdn.shopify.com/s/files/1/0611/4158/1902/files/VVS2.png?v=1723136633",
  },
  {
    value: 3,
    label: "VVS1",
    description:
      "Minute inclusions extremely difficult to see at 10x magnification.",
    src: "https://cdn.shopify.com/s/files/1/0611/4158/1902/files/VVS1.png?v=1723136441",
  },
];

const ClaritySlider = memo(function ClaritySlider({
  clarity,
}: {
  clarity: StoneClarity;
}) {
  const [value, setValue] = useState<number | number[]>(
    clarities.find(({ label }) => label === clarity)?.value ?? 0,
  );

  const selectedClarity = useMemo(
    () => clarities[Array.isArray(value) ? value[0] : value],
    [value],
  );

  return (
    <div className="flex grow flex-col gap-6">
      <Slider
        aria-label="clarity slider"
        showSteps
        color="secondary"
        size="sm"
        marks={clarities}
        defaultValue={clarities.find(({ label }) => label === clarity)?.value}
        maxValue={3}
        onChange={setValue}
        className="mx-auto mt-6 max-w-md"
        getValue={(value: SliderValue) =>
          Array.isArray(value)
            ? clarities[value[0]].label
            : clarities[value].label
        }
      />
      <div className="flex h-36 w-full justify-center">
        <NextImage
          width={144}
          height={144}
          alt="Diamond clarity preview"
          className="object-contain"
          src={selectedClarity.src}
        />
      </div>
      <div className="mt-auto bg-primary p-3 font-mono md:p-6">
        <p>{selectedClarity.description}</p>
      </div>
    </div>
  );
});

const colors = [
  {
    value: 0,
    label: "G",
    description:
      "Near colorless, with a slight hint of color that is difficult to detect without comparison to diamonds of higher color grades.",
  },
  {
    value: 1,
    label: "F",
    description:
      "Considered colorless, but with very slight color detectable by an expert gemologist.",
  },
  {
    value: 2,
    label: "E",
    description:
      "Nearly colorless, with minute traces of color that are undetectable to the untrained eye.",
  },
  {
    value: 3,
    label: "D",
    description: "Completely colorless, the highest grade on the GIA scale.",
  },
];

const ColorSlider = memo(function ColorSlider({
  color,
}: {
  color: StoneColor;
}) {
  const [value, setValue] = useState<number | number[]>(
    colors.find(({ label }) => label === color)?.value ?? 0,
  );

  return (
    <div className="flex flex-col gap-6">
      <Slider
        aria-label="color slider"
        showSteps
        color="secondary"
        size="sm"
        marks={colors}
        defaultValue={colors.find(({ label }) => label === color)?.value}
        maxValue={3}
        onChange={setValue}
        className="mx-auto mt-6 max-w-md"
        getValue={(value: SliderValue) =>
          Array.isArray(value) ? colors[value[0]].label : colors[value].label
        }
      />
      <div className="relative mx-auto h-36 w-full max-w-sm">
        <div
          className="absolute inset-0 z-10 flex justify-center"
          style={{ opacity: Array.isArray(value) ? value[0] / 3 : value / 3 }}
        >
          <NextImage
            width={200}
            height={144}
            alt="Diamond D Color"
            className="object-contain"
            src="https://cdn.shopify.com/s/files/1/0611/4158/1902/files/diamond-color-d.png?v=1723133363"
          />
        </div>
        <div className="absolute inset-0 flex justify-center">
          <NextImage
            width={200}
            height={144}
            alt="Diamond J Color"
            src="https://cdn.shopify.com/s/files/1/0611/4158/1902/files/diamond-color-j.png?v=1723133429"
          />
        </div>
      </div>

      <div className="mt-auto bg-primary p-3 font-mono md:p-6">
        <p>{colors[Array.isArray(value) ? value[0] : value].description}</p>
      </div>
    </div>
  );
});

const contents = (specifications: StoneSpecifications) => [
  {
    title: "Clarity",
    description:
      "Refers to the presence of internal (inclusions) and external (blemishes) imperfections. Higher clarity means fewer inclusions, which can affect the diamond's brilliance and value.",
    slider: <ClaritySlider clarity={specifications.clarity} />,
  },
  {
    title: "Color",
    description: (
      <>
        The GIA color scale for diamonds ranges from D to Z, indicating the
        degree of colorlessness to increasing presence of color. The 23 color
        grades are divided into five subcategories. which are: colorless (D-F),
        near colorless (G-J); faint (K-M); very light (N-R); and light (S-Z).
        <br />
        <strong>
          Harich Jewelry exclusively offers diamonds in color grades D, E, F,
          and G.
        </strong>
      </>
    ),
    slider: <ColorSlider color={specifications.color} />,
  },
  {
    title: "Carat",
    description:
      "Carat is the unit used to measure the weight of a lab grown diamonds. One carat equals 0.2 grams, or 200 milligrams. Although carat weight and stone size generally increase together, this isn't always noticeably the case, depending on the shape and cut of the gemstone.",
  },
  {
    title: "Cut",
    description:
      "Cut refers to how well a diamond is fashioned and its proportions, symmetry, and polish. Cut significantly impacts a diamond's brilliance and sparkle. A well-cut diamond will appear more brilliant and can even look larger than its carat weight.",
  },
];

export const StoneFourC = memo(function StoneFourC({
  specifications,
}: {
  specifications: Array<{ key: string; value: string } | null>;
}) {
  return (
    <section className="mx-auto flex flex-col">
      <h1
        className={cn(
          title({
            size: "sm",
          }),
        )}
      >
        The Four C&apos;s of Lab Diamond
      </h1>
      <ul className="mt-6 grid gap-6 md:grid-cols-2">
        {contents(reshapeStoneSpecifications(specifications)).map(
          (content, index) => (
            <li
              className="flex flex-col gap-3 border border-default-700 p-6"
              key={index}
            >
              <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
                {content.title}
              </h2>
              <p className="font-mono text-sm text-default-700">
                {content.description}
              </p>
              {content.slider}
            </li>
          ),
        )}
      </ul>
    </section>
  );
});
