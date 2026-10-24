import {
  createContext,
  forwardRef,
  useContext,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Tooltip } from '../../components/Tooltip/Tooltip';

export const SidebarCollapseContext = createContext(false);

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name for the primary navigation landmark. */
  label: string;
  /** Optional branded or contextual content above navigation items. */
  header?: ReactNode;
  /** Optional utility content pinned below navigation items. */
  footer?: ReactNode;
  /** Standalone collapse state; an enclosing AppShell provides it automatically. */
  collapsed?: boolean;
}

/** Semantic application navigation with stable expanded and collapsed geometry. */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { label, header, footer, collapsed, className, children, ...props },
  ref,
) {
  const inheritedCollapsed = useContext(SidebarCollapseContext);
  const resolvedCollapsed = collapsed ?? inheritedCollapsed;

  return (
    <SidebarCollapseContext.Provider value={resolvedCollapsed}>
      <aside
        {...props}
        ref={ref}
        className={['kw-sidebar', className].filter(Boolean).join(' ')}
        data-collapsed={resolvedCollapsed || undefined}
      >
        {header ? <div className="kw-sidebar__header">{header}</div> : null}
        <nav className="kw-sidebar__navigation" aria-label={label}>
          {children}
        </nav>
        {footer ? <div className="kw-sidebar__footer">{footer}</div> : null}
      </aside>
    </SidebarCollapseContext.Provider>
  );
});

export interface SidebarItemProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Visible and accessible destination name. */
  label: string;
  /** Decorative icon from the shared icon package. */
  icon?: ReactNode;
  /** Marks the destination as the current page. */
  active?: boolean;
}

/** Navigation link that preserves its accessible name when the sidebar is collapsed. */
export const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(
  function SidebarItem(
    { label, icon, active = false, className, ...props },
    ref,
  ) {
    const collapsed = useContext(SidebarCollapseContext);
    const link = (
      <a
        {...props}
        ref={ref}
        className={['kw-sidebar-item', className].filter(Boolean).join(' ')}
        aria-current={active ? 'page' : props['aria-current']}
      >
        {icon ? (
          <span className="kw-sidebar-item__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span className="kw-sidebar-item__label">{label}</span>
      </a>
    );

    return collapsed && icon ? (
      <Tooltip content={label} side="right" delayDuration={220}>
        {link}
      </Tooltip>
    ) : (
      link
    );
  },
);
