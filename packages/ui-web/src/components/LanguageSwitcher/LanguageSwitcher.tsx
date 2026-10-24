import { forwardRef, type CSSProperties } from 'react';
import { Select } from '../Select/Select';

export interface LanguageOption {
  /** Stable locale or application language identifier. */
  value: string;
  /** Human-readable language name; flags are not used as a substitute. */
  label: string;
  disabled?: boolean;
}

export interface LanguageSwitcherProps {
  /** Localized field label. */
  label: string;
  /** Languages supplied by the consuming application's i18n boundary. */
  options: readonly LanguageOption[];
  /** Controlled language identifier. */
  value?: string;
  /** Initial identifier for uncontrolled use. */
  defaultValue?: string;
  /** Reports selection changes without changing dictionaries or routes. */
  onValueChange?: (value: string) => void;
  /** Keeps the label accessible while visually hiding it in compact toolbars. */
  labelVisibility?: 'visible' | 'sr-only';
  /** Visual control density without shadowing the native select size attribute. */
  controlSize?: 'sm' | 'md';
  /** Prevents the language preference from being changed. */
  disabled?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

/** Language selector adapter; translation data and routing remain application-owned. */
export const LanguageSwitcher = forwardRef<
  HTMLButtonElement,
  LanguageSwitcherProps
>(function LanguageSwitcher(
  {
    label,
    options,
    value,
    defaultValue,
    onValueChange,
    labelVisibility = 'visible',
    controlSize = 'md',
    className,
    style,
    ...props
  },
  ref,
) {
  return (
    <span
      className={['kw-language-switcher', className].filter(Boolean).join(' ')}
      style={style}
    >
      <span className="kw-language-switcher__sizer" aria-hidden="true">
        {options.map((option) => (
          <span key={option.value}>{option.label}</span>
        ))}
      </span>
      <Select
        {...props}
        ref={ref}
        label={label}
        options={options}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        labelVisibility={labelVisibility}
        size={controlSize}
      />
    </span>
  );
});
