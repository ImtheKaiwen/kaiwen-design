import * as React from "react";
import { cn } from "@kaiwen/utilities";
import { spacing, type SpacingKey } from "@kaiwen/tokens";

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  p?: SpacingKey;
  px?: SpacingKey;
  py?: SpacingKey;
  pt?: SpacingKey;
  pb?: SpacingKey;
  pl?: SpacingKey;
  pr?: SpacingKey;
  m?: SpacingKey;
  mx?: SpacingKey;
  my?: SpacingKey;
  mt?: SpacingKey;
  mb?: SpacingKey;
  ml?: SpacingKey;
  mr?: SpacingKey;
  children?: React.ReactNode;
}

export const Box = React.forwardRef<HTMLElement, BoxProps>(
  (
    {
      as: Component = "div",
      p,
      px,
      py,
      pt,
      pb,
      pl,
      pr,
      m,
      mx,
      my,
      mt,
      mb,
      ml,
      mr,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const spacingStyles: React.CSSProperties = {
      ...(p ? { padding: spacing[p] } : {}),
      ...(px ? { paddingLeft: spacing[px], paddingRight: spacing[px] } : {}),
      ...(py ? { paddingTop: spacing[py], paddingBottom: spacing[py] } : {}),
      ...(pt ? { paddingTop: spacing[pt] } : {}),
      ...(pb ? { paddingBottom: spacing[pb] } : {}),
      ...(pl ? { paddingLeft: spacing[pl] } : {}),
      ...(pr ? { paddingRight: spacing[pr] } : {}),
      ...(m ? { margin: spacing[m] } : {}),
      ...(mx ? { marginLeft: spacing[mx], marginRight: spacing[mx] } : {}),
      ...(my ? { marginTop: spacing[my], marginBottom: spacing[my] } : {}),
      ...(mt ? { marginTop: spacing[mt] } : {}),
      ...(mb ? { marginBottom: spacing[mb] } : {}),
      ...(ml ? { marginLeft: spacing[ml] } : {}),
      ...(mr ? { marginRight: spacing[mr] } : {}),
    };

    return (
      <Component
        ref={ref}
        className={cn("kaiwen-box", className)}
        style={{ ...spacingStyles, ...style }}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Box.displayName = "Box";
