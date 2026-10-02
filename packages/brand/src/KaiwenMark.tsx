import * as React from "react";
import { KAIWEN_MARK_PATH } from "./kaiwen-mark-path.js";

export interface KaiwenMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

/**
 * Kaiwen Official Brand Mark (Geometric K Glyph)
 * Direct vector representation from official brand assets.
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
      viewBox="0 0 100 100"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <path d={KAIWEN_MARK_PATH} fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
};
