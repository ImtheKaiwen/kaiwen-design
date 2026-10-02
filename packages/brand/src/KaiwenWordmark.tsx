import * as React from "react";

export interface KaiwenWordmarkProps extends React.SVGProps<SVGSVGElement> {
  height?: number | string;
  color?: string;
}

/**
 * Kaiwen Wordmark (Typography Logo)
 */
export const KaiwenWordmark: React.FC<KaiwenWordmarkProps> = ({
  height = 20,
  color = "currentColor",
  style,
  ...props
}) => {
  return (
    <svg
      height={height}
      viewBox="0 0 120 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <text
        x="0"
        y="21"
        fill={color}
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif"
        fontSize="21"
        fontWeight="700"
        letterSpacing="-0.04em"
      >
        KAIWEN
      </text>
    </svg>
  );
};
