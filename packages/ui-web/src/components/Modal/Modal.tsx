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

export interface ModalProps {
  /** Optional control that opens the dialog. */
  trigger?: ReactElement;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled use. */
  defaultOpen?: boolean;
  /** Reports controlled and uncontrolled state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Dialog width preset. */
  size?: 'sm' | 'md' | 'lg';
  /** Allows pointer interaction outside the surface to close it. */
  closeOnOutsideClick?: boolean;
  /** Accessible name for the close control. */
  closeLabel?: string;
  /** Fallback accessible name when no ModalHeader title is rendered. */
  ariaLabel?: string;
  /** Overrides global motion without bypassing reduced-motion. */
  motion?: MotionPreference;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Accessible general-purpose dialog built on the shared Radix primitive. */
export function Modal({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  size = 'md',
  closeOnOutsideClick = true,
  closeLabel = 'Close dialog',
  ariaLabel,
  motion = 'inherit',
  children,
  className,
  style,
}: ModalProps) {
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
          className={['kaiwen-scope', 'kw-modal', className]
            .filter(Boolean)
            .join(' ')}
          data-theme={resolvedTheme}
          data-density={density}
          data-motion-level={level}
          data-size={size}
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

export interface ModalHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
}

/** Semantic title and optional description region for Modal. */
export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  function ModalHeader({ title, description, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={['kw-modal__header', className].filter(Boolean).join(' ')}
      >
        <Dialog.Title className="kw-modal__title">{title}</Dialog.Title>
        {description ? (
          <Dialog.Description className="kw-modal__description">
            {description}
          </Dialog.Description>
        ) : null}
      </div>
    );
  },
);

/** Scrollable primary content region for Modal. */
export const ModalContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function ModalContent({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={['kw-modal__content', className].filter(Boolean).join(' ')}
    />
  );
});

/** Action region aligned to the end of Modal. */
export const ModalFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function ModalFooter({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={['kw-modal__footer', className].filter(Boolean).join(' ')}
    />
  );
});
