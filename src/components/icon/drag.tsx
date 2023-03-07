import { SVGProps } from 'react';

export function DashiconsMove(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        fill="currentColor"
        d="m19 10l-4 4v-3h-4v4h3l-4 4l-4-4h3v-4H5v3l-4-4l4-4v3h4V5H6l4-4l4 4h-3v4h4V6z"
      ></path>
    </svg>
  );
}
