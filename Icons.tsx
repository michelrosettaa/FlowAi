import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      {/* ... */}
    </svg>
  );
}
// repeat the same IconProps for each exported icon function
