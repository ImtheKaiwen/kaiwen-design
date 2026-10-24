import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, X } from '@imthekaiwen/icons';
import { useMotionPolicy } from '@imthekaiwen/motion';
import { useKaiwenPreferences } from '../../providers/KaiwenProvider';

export interface CommandPaletteItem {
  /** Stable identifier used for focus and selection. */
  id: string;
  /** Searchable visible command name. */
  label: string;
  /** Optional searchable supporting text. */
  description?: string;
  /** Extra terms that should match the command without being displayed. */
  keywords?: readonly string[];
  /** Optional visual icon; decorative icons should be aria-hidden. */
  icon?: ReactNode;
  /** Optional keyboard shortcut hint owned by the consuming application. */
  shortcut?: string;
  /** Prevents focus and selection while keeping the command discoverable. */
  disabled?: boolean;
}

export interface CommandPaletteProps {
  /** Commands rendered and filtered by the palette. */
  items: readonly CommandPaletteItem[];
  /** Called with the selected command before the palette closes. */
  onSelect: (item: CommandPaletteItem) => void;
  /** Accessible dialog title. */
  title: string;
  /** Optional accessible dialog description. */
  description?: string;
  /** Accessible label for the search input. */
  searchLabel: string;
  /** Search input placeholder. */
  placeholder?: string;
  /** Message shown when filtering returns no commands. */
  emptyLabel: string;
  /** Accessible label for the close control. */
  closeLabel: string;
  /** Optional trigger composed with Radix `asChild`. */
  trigger?: ReactElement;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled use. */
  defaultOpen?: boolean;
  /** Reports dialog state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Enables the conventional Control/Command + K global shortcut. */
  enableShortcut?: boolean;
  className?: string;
}

/** Accessible searchable command dialog with keyboard navigation and focus restoration. */
export const CommandPalette = forwardRef<HTMLInputElement, CommandPaletteProps>(
  function CommandPalette(
    {
      items,
      onSelect,
      title,
      description,
      searchLabel,
      placeholder,
      emptyLabel,
      closeLabel,
      trigger,
      open,
      defaultOpen = false,
      onOpenChange,
      enableShortcut = false,
      className,
    },
    forwardedRef,
  ) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [query, setQuery] = useState('');
    const [activeId, setActiveId] = useState<string | undefined>();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const listId = `kw-command-list-${useId()}`;
    const resolvedOpen = open ?? internalOpen;
    const { resolvedTheme, density, locale } = useKaiwenPreferences();
    const { level, preset } = useMotionPolicy();

    const filteredItems = useMemo(() => {
      const normalizedQuery = query.trim().toLocaleLowerCase(locale);
      if (!normalizedQuery) return items;
      return items.filter((item) =>
        [item.label, item.description, ...(item.keywords ?? [])]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase(locale)
          .includes(normalizedQuery),
      );
    }, [items, locale, query]);

    const enabledItems = filteredItems.filter((item) => !item.disabled);
    const activeItem =
      enabledItems.find((item) => item.id === activeId) ?? enabledItems[0];

    const setOpen = useCallback(
      (nextOpen: boolean) => {
        if (open === undefined) setInternalOpen(nextOpen);
        if (!nextOpen) {
          setQuery('');
          setActiveId(undefined);
        }
        onOpenChange?.(nextOpen);
      },
      [onOpenChange, open],
    );

    useEffect(() => {
      if (!enableShortcut) return;
      const handleShortcut = (event: globalThis.KeyboardEvent) => {
        if (
          event.key.toLocaleLowerCase() !== 'k' ||
          !(event.metaKey || event.ctrlKey)
        )
          return;
        event.preventDefault();
        setOpen(!resolvedOpen);
      };
      window.addEventListener('keydown', handleShortcut);
      return () => window.removeEventListener('keydown', handleShortcut);
    }, [enableShortcut, resolvedOpen, setOpen]);

    const selectItem = (item: CommandPaletteItem) => {
      if (item.disabled) return;
      onSelect(item);
      setOpen(false);
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (!enabledItems.length) return;
      const currentIndex = activeItem ? enabledItems.indexOf(activeItem) : -1;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        const nextIndex =
          (currentIndex + direction + enabledItems.length) %
          enabledItems.length;
        setActiveId(enabledItems[nextIndex]?.id);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        setActiveId(
          (event.key === 'Home' ? enabledItems[0] : enabledItems.at(-1))?.id,
        );
      } else if (event.key === 'Enter' && activeItem) {
        event.preventDefault();
        selectItem(activeItem);
      }
    };

    return (
      <Dialog.Root open={resolvedOpen} onOpenChange={setOpen}>
        {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
        <Dialog.Portal>
          <Dialog.Overlay
            className="kaiwen-scope kw-command-palette__overlay"
            data-theme={resolvedTheme}
            data-density={density}
            data-motion-level={level}
          />
          <Dialog.Content
            className={['kaiwen-scope', 'kw-command-palette', className]
              .filter(Boolean)
              .join(' ')}
            data-theme={resolvedTheme}
            data-density={density}
            data-motion-level={level}
            lang={locale}
            style={
              {
                '--kw-command-motion-duration': `${preset.durationMs}ms`,
                '--kw-command-motion-easing': preset.easing,
              } as CSSProperties
            }
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              inputRef.current?.focus();
            }}
          >
            <div className="kw-command-palette__header">
              <div>
                <Dialog.Title className="kw-command-palette__title">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="kw-command-palette__description">
                  {description ?? searchLabel}
                </Dialog.Description>
              </div>
              <Dialog.Close
                className="kw-command-palette__close"
                aria-label={closeLabel}
              >
                <X size={17} aria-hidden />
              </Dialog.Close>
            </div>
            <div className="kw-command-palette__search">
              <Search size={18} aria-hidden />
              <input
                ref={(node) => {
                  inputRef.current = node;
                  if (typeof forwardedRef === 'function') forwardedRef(node);
                  else if (forwardedRef) forwardedRef.current = node;
                }}
                type="search"
                role="combobox"
                aria-label={searchLabel}
                aria-expanded="true"
                aria-autocomplete="list"
                aria-controls={listId}
                aria-activedescendant={
                  activeItem ? `${listId}-${activeItem.id}` : undefined
                }
                value={query}
                placeholder={placeholder}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveId(undefined);
                }}
                onKeyDown={handleInputKeyDown}
              />
              <kbd>Esc</kbd>
            </div>
            <div
              id={listId}
              className="kw-command-palette__list"
              role="listbox"
              aria-label={title}
            >
              {filteredItems.length ? (
                filteredItems.map((item) => {
                  const active = activeItem?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`${listId}-${item.id}`}
                      className="kw-command-palette__item"
                      type="button"
                      role="option"
                      aria-selected={active}
                      disabled={item.disabled}
                      onPointerMove={() =>
                        !item.disabled && setActiveId(item.id)
                      }
                      onClick={() => selectItem(item)}
                    >
                      {item.icon ? (
                        <span className="kw-command-palette__item-icon">
                          {item.icon}
                        </span>
                      ) : null}
                      <span className="kw-command-palette__item-copy">
                        <strong>{item.label}</strong>
                        {item.description ? (
                          <span>{item.description}</span>
                        ) : null}
                      </span>
                      {item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
                    </button>
                  );
                })
              ) : (
                <p className="kw-command-palette__empty">{emptyLabel}</p>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
);
