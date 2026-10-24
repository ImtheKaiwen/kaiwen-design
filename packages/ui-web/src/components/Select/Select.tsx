import { forwardRef, useId, type CSSProperties, type ReactNode } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from '@imthekaiwen/icons';
import { useMotionPolicy } from '@imthekaiwen/motion';
import { useKaiwenPreferences } from '../../providers/KaiwenProvider';

export interface SelectOption {
  /** Stable value submitted to the consuming application. */
  value: string;
  /** Primary visible option name. */
  label: ReactNode;
  /** Optional supporting explanation shown below the option name. */
  description?: ReactNode;
  /** Prevents this option from being selected. */
  disabled?: boolean;
}

export interface SelectProps {
  /** Localized field label associated with the trigger. */
  label: string;
  /** Options owned by the consuming application. */
  options: readonly SelectOption[];
  /** Controlled selected value. */
  value?: string | undefined;
  /** Initial value for uncontrolled use. */
  defaultValue?: string | undefined;
  /** Reports selection changes. */
  onValueChange?: ((value: string) => void) | undefined;
  /** Text shown when no option has been selected. */
  placeholder?: string;
  /** Keeps the label accessible while visually hiding it. */
  labelVisibility?: 'visible' | 'sr-only';
  /** Visual density of the trigger. */
  size?: 'sm' | 'md';
  /** Native form field name. */
  name?: string;
  /** Marks the field as required for native form submission. */
  required?: boolean;
  /** Prevents the control from opening or changing. */
  disabled?: boolean;
  /** Stable trigger id used by forms and tests. */
  id?: string;
  className?: string;
}

/** Accessible custom select with keyboard navigation and collision-aware overlay. */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  function Select(
    {
      label,
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder,
      labelVisibility = 'visible',
      size = 'md',
      name,
      required,
      disabled,
      id,
      className,
    },
    ref,
  ) {
    const generatedId = useId();
    const triggerId = id ?? `kw-select-${generatedId}`;
    const labelId = `${triggerId}-label`;
    const { resolvedTheme, density, locale } = useKaiwenPreferences();
    const { level, preset } = useMotionPolicy();

    return (
      <div
        className={['kw-select-field', className].filter(Boolean).join(' ')}
        data-label-visibility={labelVisibility}
        data-size={size}
        data-disabled={disabled || undefined}
      >
        <label
          id={labelId}
          className="kw-select-field__label"
          htmlFor={triggerId}
        >
          {label}
        </label>
        <SelectPrimitive.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          name={name}
          required={required}
          disabled={disabled}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            id={triggerId}
            className="kw-select__trigger"
            aria-labelledby={labelId}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon className="kw-select__chevron">
              <ChevronDown size={15} aria-hidden />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className="kaiwen-scope kw-select__content"
              data-theme={resolvedTheme}
              data-density={density}
              data-motion-level={level}
              lang={locale}
              position="popper"
              sideOffset={4}
              collisionPadding={8}
              style={
                {
                  '--kw-select-motion-duration': `${preset.durationMs}ms`,
                  '--kw-select-motion-easing': preset.easing,
                } as CSSProperties
              }
            >
              <SelectPrimitive.Viewport className="kw-select__viewport">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    className="kw-select__item"
                    value={option.value}
                    disabled={option.disabled}
                  >
                    <SelectPrimitive.ItemIndicator className="kw-select__indicator">
                      <Check size={15} aria-hidden />
                    </SelectPrimitive.ItemIndicator>
                    <span className="kw-select__item-copy">
                      <SelectPrimitive.ItemText>
                        {option.label}
                      </SelectPrimitive.ItemText>
                      {option.description ? (
                        <span className="kw-select__item-description">
                          {option.description}
                        </span>
                      ) : null}
                    </span>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </div>
    );
  },
);
