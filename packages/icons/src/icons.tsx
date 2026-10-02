import * as React from "react";
import type { IconProps } from "./types.js";

const createIcon = (
  displayName: string,
  svgContent: (color: string) => React.ReactNode,
): React.FC<IconProps> => {
  const Icon: React.FC<IconProps> = ({
    size = 20,
    color = "currentColor",
    title,
    style,
    ...props
  }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
        aria-hidden={title ? undefined : "true"}
        role={title ? "img" : "presentation"}
        {...props}
      >
        {title && <title>{title}</title>}
        {svgContent(color)}
      </svg>
    );
  };
  Icon.displayName = displayName;
  return Icon;
};

export const SearchIcon = createIcon("SearchIcon", () => (
  <>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </>
));

export const CheckIcon = createIcon("CheckIcon", () => (
  <polyline points="20 6 9 17 4 12" />
));

export const CloseIcon = createIcon("CloseIcon", () => (
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>
));
export const XIcon = CloseIcon;

export const EyeIcon = createIcon("EyeIcon", () => (
  <>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </>
));

export const EyeOffIcon = createIcon("EyeOffIcon", () => (
  <>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </>
));

export const ChevronDownIcon = createIcon("ChevronDownIcon", () => (
  <polyline points="6 9 12 15 18 9" />
));

export const ChevronUpIcon = createIcon("ChevronUpIcon", () => (
  <polyline points="18 15 12 9 6 15" />
));

export const ChevronRightIcon = createIcon("ChevronRightIcon", () => (
  <polyline points="9 18 15 12 9 6" />
));

export const ChevronLeftIcon = createIcon("ChevronLeftIcon", () => (
  <polyline points="15 18 9 12 15 6" />
));

export const AlertCircleIcon = createIcon("AlertCircleIcon", () => (
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </>
));

export const CheckCircleIcon = createIcon("CheckCircleIcon", () => (
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="16 9 11 14 8 11" />
  </>
));

export const InfoIcon = createIcon("InfoIcon", () => (
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </>
));

export const SpinnerIcon = createIcon("SpinnerIcon", () => (
  <>
    <path d="M12 2v4" opacity="0.3" />
    <path d="M12 18v4" opacity="0.7" />
    <path d="M4.93 4.93l2.83 2.83" opacity="0.2" />
    <path d="M16.24 16.24l2.83 2.83" opacity="0.8" />
    <path d="M2 12h4" opacity="0.1" />
    <path d="M18 12h4" opacity="0.9" />
    <path d="M4.93 19.07l2.83-2.83" opacity="0.5" />
    <path d="M16.24 7.76l2.83-2.83" />
  </>
));

export const CopyIcon = createIcon("CopyIcon", () => (
  <>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </>
));

export const MoonIcon = createIcon("MoonIcon", () => (
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
));

export const SunIcon = createIcon("SunIcon", () => (
  <>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </>
));

export const ArrowRightIcon = createIcon("ArrowRightIcon", () => (
  <>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </>
));

export const UserIcon = createIcon("UserIcon", () => (
  <>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>
));
