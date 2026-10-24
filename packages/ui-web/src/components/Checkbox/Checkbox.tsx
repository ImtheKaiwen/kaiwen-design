import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { Check, Minus } from '@imthekaiwen/icons';

export type CheckboxState = boolean | 'indeterminate';

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'defaultChecked' | 'onChange' | 'type'
  > {
  /** Controlled checked or mixed state. */
  checked?: CheckboxState;
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean;
  /** Called whenever user interaction requests a boolean state change. */
  onCheckedChange?: (checked: boolean) => void;
  /** Accessible label displayed beside the control. */
  label: ReactNode;
  /** Optional supporting text. */
  description?: ReactNode;
  /** Visually hides the label while preserving its accessible name. */
  labelVisibility?: 'visible' | 'sr-only';
}

/** Native checkbox with controlled, uncontrolled and indeterminate states. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      label,
      description,
      labelVisibility = 'visible',
      disabled,
      className,
      ...props
    },
    forwardedRef,
  ) {
    const generatedId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isControlled = checked !== undefined;
    const current = isControlled ? checked : internalChecked;
    const isIndeterminate = current === 'indeterminate';
    const isChecked = current === true;
    const labelId = `kw-checkbox-${generatedId}-label`;
    const descriptionId = `kw-checkbox-${generatedId}-description`;

    useImperativeHandle(forwardedRef, () => inputRef.current!, []);

    return (
      <label
        className={['kw-checkbox-field', className].filter(Boolean).join(' ')}
        data-disabled={disabled || undefined}
      >
        <span className="kw-checkbox-control">
          <input
            {...props}
            ref={(node) => {
              inputRef.current = node;
              if (node) node.indeterminate = isIndeterminate;
            }}
            type="checkbox"
            checked={isChecked}
            disabled={disabled}
            aria-checked={isIndeterminate ? 'mixed' : isChecked}
            aria-labelledby={props['aria-labelledby'] ?? labelId}
            aria-describedby={
              props['aria-describedby'] ??
              (description ? descriptionId : undefined)
            }
            onChange={(event) => {
              const next = event.currentTarget.checked;
              if (!isControlled) setInternalChecked(next);
              onCheckedChange?.(next);
            }}
          />
          <span className="kw-checkbox" aria-hidden="true">
            {isIndeterminate ? <Minus size={14} /> : <Check size={14} />}
          </span>
        </span>
        <span className="kw-checkbox-copy" data-visibility={labelVisibility}>
          <span className="kw-checkbox-label" id={labelId}>
            {label}
          </span>
          {description ? (
            <span className="kw-checkbox-description" id={descriptionId}>
              {description}
            </span>
          ) : null}
        </span>
      </label>
    );
  },
);
