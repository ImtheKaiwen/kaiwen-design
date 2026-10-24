import { forwardRef, useState, type ButtonHTMLAttributes } from 'react';
import { motion } from 'motion/react';
import { useMotionPolicy, type MotionPreference } from '@imthekaiwen/motion';

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial value for uncontrolled usage. */
  defaultChecked?: boolean;
  /** Called whenever user interaction requests a state change. */
  onCheckedChange?: (checked: boolean) => void;
  /** Overrides global motion without bypassing reduced-motion. */
  motion?: MotionPreference;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch(
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      motion: motionOverride = 'inherit',
      disabled,
      className,
      type = 'button',
      onClick,
      ...props
    },
    ref,
  ) {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isControlled = checked !== undefined;
    const current = isControlled ? checked : internalChecked;
    const { level, preset } = useMotionPolicy(motionOverride);
    const transition =
      level === 'off'
        ? { duration: 0 }
        : {
            x: preset.transition,
            scaleX: {
              type: 'tween',
              duration: preset.durationMs / 1000,
              ease: [0.2, 0, 0, 1],
              times: [0, 0.45, 1],
            },
          };
    const stretch =
      level === 'expressive'
        ? [1, preset.switchStretch, 1]
        : level === 'balanced'
          ? [1, preset.switchStretch, 1]
          : 1;

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        role="switch"
        aria-checked={current}
        disabled={disabled}
        data-state={current ? 'checked' : 'unchecked'}
        className={['kw-switch', className].filter(Boolean).join(' ')}
        onClick={(event) => {
          if (!disabled) {
            const next = !current;
            if (!isControlled) setInternalChecked(next);
            onCheckedChange?.(next);
          }
          onClick?.(event);
        }}
      >
        <motion.span
          className="kw-switch__thumb"
          aria-hidden="true"
          animate={{ x: current ? 18 : 0, scaleX: stretch }}
          transition={transition}
        />
      </button>
    );
  },
);
