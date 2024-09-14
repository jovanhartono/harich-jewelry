export const Prose = ({ body }: { body: string }) => {
  return (
    <div
      className={
        "prose mb-8 mt-9 max-w-max 2xl:prose-lg prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-pretty prose-p:text-neutral-800"
      }
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
};
