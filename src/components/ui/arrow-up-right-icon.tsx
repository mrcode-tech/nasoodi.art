import type { SVGProps } from "react";

type ArrowUpRightIconProps = SVGProps<SVGSVGElement>;

export function ArrowUpRightIcon(props: ArrowUpRightIconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block shrink-0 align-[-0.12em]"
      {...props}
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
