export const Prose = ({ body }: { body: string }) => {
  return (
    <div
      className={
        "md:prose-md prose mb-8 mt-9 max-w-max xl:prose-lg prose-headings:tracking-tight prose-p:text-pretty prose-p:text-black"
      }
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
};
