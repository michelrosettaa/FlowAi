import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

export const CheckIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MailIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2" />
    <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

// add any other icons here with the same IconProps signature…
