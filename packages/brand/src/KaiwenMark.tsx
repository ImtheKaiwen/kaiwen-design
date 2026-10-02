import * as React from "react";

export interface KaiwenMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

/**
 * Kaiwen Brand Mark (Geometric Icon Glyph)
 */
export const KaiwenMark: React.FC<KaiwenMarkProps> = ({
  size = 24,
  color = "currentColor",
  style,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      {/* Outer Hexagon / Shield Frame */}
      <path
        d="M16 2.5L28 9.5V22.5L16 29.5L4 22.5V9.5L16 2.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Stylized K Core */}
      <path
        d="M11 9V23"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M21 10L12 16L21 22"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="1.5" fill={color} />
    </svg>
  );
};
