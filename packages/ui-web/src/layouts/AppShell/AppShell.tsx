import {
  forwardRef,
  useEffect,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { useMotionPolicy, type MotionPreference } from '@imthekaiwen/motion';
import { SidebarCollapseContext } from '../../navigation/Sidebar/Sidebar';

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Application navigation rendered in the shell's sidebar slot. */
  sidebar: ReactNode;
  /** Optional sticky desktop toolbar. */
  topbar?: ReactNode;
  /** Optional sticky compact header shown at mobile widths. */
  mobileHeader?: ReactNode;
  /** Reduces the desktop sidebar to its icon rail width. */
  sidebarCollapsed?: boolean;
  /** Controlled mobile drawer visibility. */
  sidebarOpen?: boolean;
  /** Called when Escape or the mobile backdrop requests drawer dismissal. */
  onSidebarOpenChange?: (open: boolean) => void;
  /** Localized accessible name for the mobile drawer backdrop button. */
  dismissSidebarLabel: string;
  /** Stable id assigned to the main content landmark. */
  contentId?: string;
  /** Localized label for an optional skip link targeting the main content. */
  skipLinkLabel?: string;
  /** Overrides shell layout motion without bypassing reduced-motion. */
  motion?: MotionPreference;
}

/** Responsive application frame with explicit sidebar, header and main scroll ownership. */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  function AppShell(
    {
      sidebar,
      topbar,
      mobileHeader,
      sidebarCollapsed = false,
      sidebarOpen = false,
      onSidebarOpenChange,
      dismissSidebarLabel,
      contentId = 'main-content',
      skipLinkLabel,
      motion: motionOverride = 'inherit',
      className,
      style,
      children,
      ...props
    },
    ref,
  ) {
    const { level, preset } = useMotionPolicy(motionOverride);
    useEffect(() => {
      if (!sidebarOpen || !onSidebarOpenChange) return undefined;
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') onSidebarOpenChange(false);
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [sidebarOpen, onSidebarOpenChange]);

    return (
      <SidebarCollapseContext.Provider value={sidebarCollapsed}>
        <div
          {...props}
          ref={ref}
          className={['kw-app-shell', className].filter(Boolean).join(' ')}
          data-sidebar-collapsed={sidebarCollapsed || undefined}
          data-sidebar-open={sidebarOpen || undefined}
          data-has-mobile-header={Boolean(mobileHeader) || undefined}
          data-motion-level={level}
          style={
            {
              ...style,
              '--kw-app-shell-motion-duration': `${preset.durationMs}ms`,
              '--kw-app-shell-motion-easing': preset.easing,
            } as CSSProperties
          }
        >
          {skipLinkLabel ? (
            <a className="kw-app-shell__skip-link" href={`#${contentId}`}>
              {skipLinkLabel}
            </a>
          ) : null}
          {mobileHeader ? (
            <header className="kw-app-shell__mobile-header">
              {mobileHeader}
            </header>
          ) : null}
          <div className="kw-app-shell__sidebar-slot">{sidebar}</div>
          <div className="kw-app-shell__body">
            {topbar ? (
              <header className="kw-app-shell__topbar">{topbar}</header>
            ) : null}
            <main id={contentId} className="kw-app-shell__content">
              {children}
            </main>
          </div>
          <button
            className="kw-app-shell__backdrop"
            type="button"
            aria-label={dismissSidebarLabel}
            aria-hidden={sidebarOpen ? undefined : true}
            tabIndex={sidebarOpen ? 0 : -1}
            onClick={() => onSidebarOpenChange?.(false)}
          />
        </div>
      </SidebarCollapseContext.Provider>
    );
  },
);
