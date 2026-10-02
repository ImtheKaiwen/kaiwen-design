import * as React from "react";
import { Stack, type StackProps } from "./Stack.js";

export type FlexProps = StackProps;

export const Flex = React.forwardRef<HTMLElement, FlexProps>(
  ({ direction = "row", ...props }, ref) => {
    return <Stack ref={ref} direction={direction} {...props} />;
  },
);

Flex.displayName = "Flex";
