import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from '@imthekaiwen/icons';
import { useMotionPolicy, type MotionPreference } from '@imthekaiwen/motion';
import { useKaiwenPreferences } from '../../providers/KaiwenProvider';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
  /** Optional control that opens the drawer. */
  trigger?: ReactElement;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled use. */
  defaultOpen?: boolean;
  /** Reports controlled and uncontrolled state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Viewport edge from which the surface enters. */
  side?: DrawerSide;
  /** Insets and rounds the surface instead of attaching it to the viewport edge. */
  floating?: boolean;
  /** Allows pointer interaction outside the surface to close it. */
  closeOnOutsideClick?: boolean;
  /** Accessible name for the close control. */
  closeLabel?: string;
  /** Fallback accessible name when no DrawerHeader title is rendered. */
  ariaLabel?: string;
  /** Overrides global motion without bypassing reduced-motion. */
  motion?: MotionPreference;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Accessible sheet that slides from one viewport edge without layout shift. */
export function Drawer({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  side = 'right',
  floating = false,
  closeOnOutsideClick = true,
  closeLabel = 'Close drawer',
  ariaLabel,
  motion = 'inherit',
  children,
  className,
  style,
}: DrawerProps) {
  const { resolvedTheme, density, locale } = useKaiwenPreferences();
  const { level, preset } = useMotionPolicy(motion);
  const motionStyle = {
    '--kw-dialog-motion-duration': `${preset.durationMs}ms`,
    '--kw-dialog-motion-easing': preset.easing,
    ...style,
  } as CSSProperties;

  return (
    <Dialog.Root
      {...(open === undefined ? {} : { open })}
      {...(defaultOpen === undefined ? {} : { defaultOpen })}
      {...(onOpenChange === undefined ? {} : { onOpenChange })}
    >
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay
          className="kaiwen-scope kw-dialog-overlay"
          data-theme={resolvedTheme}
          data-motion-level={level}
        />
        <Dialog.Content
          className={['kaiwen-scope', 'kw-drawer', className]
            .filter(Boolean)
            .join(' ')}
          data-theme={resolvedTheme}
          data-density={density}
          data-motion-level={level}
          data-side={side}
          data-floating={floating || undefined}
          lang={locale}
          aria-label={ariaLabel}
          style={motionStyle}
          onInteractOutside={(event) => {
            if (!closeOnOutsideClick) event.preventDefault();
          }}
        >
          {children}
          <Dialog.Close className="kw-dialog-close" aria-label={closeLabel}>
            <X size={17} aria-hidden="true" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export interface DrawerHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
}

/** Semantic title and optional description region for Drawer. */
export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  function DrawerHeader({ title, description, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={['kw-drawer__header', className].filter(Boolean).join(' ')}
      >
        <Dialog.Title className="kw-drawer__title">{title}</Dialog.Title>
        {description ? (
          <Dialog.Description className="kw-drawer__description">
            {description}
          </Dialog.Description>
        ) : null}
      </div>
    );
  },
);

/** Scrollable primary content region for Drawer. */
export const DrawerContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function DrawerContent({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={['kw-drawer__content', className].filter(Boolean).join(' ')}
    />
  );
});

/** Action region aligned to the end of Drawer. */
export const DrawerFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function DrawerFooter({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={['kw-drawer__footer', className].filter(Boolean).join(' ')}
    />
  );
});
