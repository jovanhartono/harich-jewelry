import { Fragment, memo, ReactNode } from "react";

export const SectionMarker = memo(function SectionMarker({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Fragment>
      <div className="flex h-7 items-center justify-between text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="20 0 21 41"
          stroke="currentColor"
          className="h-full"
        >
          <path d="M0 20.5H41"></path>
          <path d="M20.5 0L20.5 41"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 41 41"
          stroke="currentColor"
          className="h-full"
        >
          <path d="M0 20.5H41"></path>
          <path d="M20.5 0L20.5 41"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 21 41"
          stroke="currentColor"
          className="h-full"
        >
          <path d="M0 20.5H41"></path>
          <path d="M20.5 0L20.5 41"></path>
        </svg>
      </div>
      {children}
      <div className="flex h-7 items-center justify-between text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="20 0 21 41"
          stroke="currentColor"
          className="h-full"
        >
          <path d="M0 20.5H41"></path>
          <path d="M20.5 0L20.5 41"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 41 41"
          stroke="currentColor"
          className="h-full"
        >
          <path d="M0 20.5H41"></path>
          <path d="M20.5 0L20.5 41"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 21 41"
          stroke="currentColor"
          className="h-full"
        >
          <path d="M0 20.5H41"></path>
          <path d="M20.5 0L20.5 41"></path>
        </svg>
      </div>
    </Fragment>
  );
});
