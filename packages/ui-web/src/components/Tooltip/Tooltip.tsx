import type { CSSProperties, ReactElement, ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { useMotionPolicy } from '@imthekaiwen/motion';
import { componentTokens } from '@imthekaiwen/tokens';
import { useKaiwenPreferences } from '../../providers/KaiwenProvider';

export interface TooltipProps {
  /** Element that owns the tooltip. It must accept a ref and accessibility props. */
  children: ReactElement;
  /** Short supplemental explanation. Essential instructions should remain visible. */
  content: ReactNode;
  /** Preferred placement; Radix resolves viewport collisions. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Delay before opening from pointer hover, in milliseconds. */
  delayDuration?: number;
}

export function Tooltip({
  children,
  content,
  side = 'top',
  delayDuration = 350,
}: TooltipProps) {
  const { resolvedTheme, density, locale } = useKaiwenPreferences();
  const { level, preset } = useMotionPolicy();
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className="kaiwen-scope kw-tooltip"
            data-theme={resolvedTheme}
            data-density={density}
            data-motion-level={level}
            lang={locale}
            side={side}
            sideOffset={componentTokens.tooltip.sideOffset}
            style={
              {
                '--kw-tooltip-duration': `${preset.durationMs}ms`,
                '--kw-tooltip-easing': preset.easing,
              } as CSSProperties
            }
          >
            {content}
            <TooltipPrimitive.Arrow
              className="kw-tooltip__arrow"
              width={componentTokens.tooltip.arrowWidth}
              height={componentTokens.tooltip.arrowHeight}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
