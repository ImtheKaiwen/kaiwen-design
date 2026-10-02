import * as React from "react";
import { KaiwenMark } from "./KaiwenMark.js";
import { KaiwenWordmark } from "./KaiwenWordmark.js";

export interface KaiwenLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: string;
  showWordmark?: boolean;
}

const sizeConfig = {
  sm: { markSize: 20, wordmarkHeight: 16, gap: 8 },
  md: { markSize: 28, wordmarkHeight: 22, gap: 10 },
  lg: { markSize: 38, wordmarkHeight: 28, gap: 12 },
};

/**
 * Kaiwen Full Logo (Mark + Wordmark)
 */
export const KaiwenLogo: React.FC<KaiwenLogoProps> = ({
  size = "md",
  color = "currentColor",
  showWordmark = true,
  style,
  ...props
}) => {
  const { markSize, wordmarkHeight, gap } = sizeConfig[size];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: `${gap}px`,
        color,
        userSelect: "none",
        ...style,
      }}
      {...props}
    >
      <KaiwenMark size={markSize} color={color} />
      {showWordmark && <KaiwenWordmark height={wordmarkHeight} color={color} />}
    </div>
  );
};
