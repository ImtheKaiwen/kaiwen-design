import {
  forwardRef,
  useId,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label associated with the native input. */
  label: ReactNode;
  /** Control height and typography. */
  size?: 'sm' | 'md' | 'lg';
  /** Supporting guidance announced after the label. */
  description?: ReactNode;
  /** Validation message; also marks the input invalid. */
  errorText?: ReactNode;
  /** Explicit invalid state when the error message is rendered elsewhere. */
  invalid?: boolean;
  /** Called with the current string value after the native change event fires. */
  onValueChange?: (value: string) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    size = 'md',
    description,
    errorText,
    invalid = false,
    onValueChange,
    id,
    className,
    onChange,
    required,
    disabled,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? `kw-input-${generatedId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = errorText ? `${inputId}-error` : undefined;
  const describedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') ||
    undefined;
  const isInvalid =
    invalid ||
    Boolean(errorText) ||
    ariaInvalid === true ||
    ariaInvalid === 'true';

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    onValueChange?.(event.currentTarget.value);
  };

  return (
    <div
      className="kw-field"
      data-disabled={disabled || undefined}
      data-invalid={isInvalid || undefined}
    >
      <label className="kw-field__label" htmlFor={inputId}>
        {label}
        {required ? (
          <span className="kw-field__required" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <input
        {...props}
        ref={ref}
        id={inputId}
        required={required}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={ariaInvalid ?? (isInvalid || undefined)}
        data-size={size}
        className={['kw-input', className].filter(Boolean).join(' ')}
        onChange={handleChange}
      />
      {description ? (
        <div className="kw-field__description" id={descriptionId}>
          {description}
        </div>
      ) : null}
      {errorText ? (
        <div className="kw-field__error" id={errorId}>
          {errorText}
        </div>
      ) : null}
    </div>
  );
});
