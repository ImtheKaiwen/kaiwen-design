import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import {
  CheckCircle2,
  CircleAlert,
  Info,
  LoaderCircle,
  TriangleAlert,
  X,
} from '@imthekaiwen/icons';
import { useMotionPolicy } from '@imthekaiwen/motion';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger' | 'loading';

export interface ToastAction {
  /** Visible and accessible action label. */
  label: string;
  /** Product-owned action callback. */
  onClick: () => void;
}

export interface ToastOptions {
  /** Stable identity used to update or deduplicate a notification. */
  id?: string;
  /** Short notification summary. */
  title: string;
  /** Optional supporting detail. */
  description?: string;
  /** Semantic urgency and token treatment. */
  tone?: ToastTone;
  /** Optional action such as Retry or Undo. */
  action?: ToastAction;
  /** Visibility duration in milliseconds. Loading notifications remain until updated or dismissed by default. */
  duration?: number;
}

type ToastRecord = ToastOptions & { id: string };

export interface ToastController {
  /** Adds a notification, or updates an existing notification with the same explicit id. */
  toast: (options: ToastOptions) => string;
  /** Updates a notification while preserving its queue position. */
  update: (id: string, patch: Partial<Omit<ToastOptions, 'id'>>) => void;
  /** Dismisses one notification. */
  dismiss: (id: string) => void;
  /** Dismisses every queued notification. */
  dismissAll: () => void;
}

export interface ToastProviderProps extends PropsWithChildren {
  /** Default visibility duration in milliseconds. */
  duration?: number;
  /** Maximum number of simultaneous notifications before queueing. */
  maxVisible?: number;
  /** Screen reader label for the notification viewport. */
  label?: string;
  /** Accessible label for each dismiss control. */
  dismissLabel?: string;
}

const ToastContext = createContext<ToastController | null>(null);

const toastIcons = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: CircleAlert,
  loading: LoaderCircle,
} as const;

export function ToastProvider({
  children,
  duration = 5000,
  maxVisible = 3,
  label = 'Notifications',
  dismissLabel = 'Dismiss notification',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(0);
  const { level } = useMotionPolicy('inherit');
  const visibleLimit = Math.max(1, Math.floor(maxVisible));

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const dismissAll = useCallback(() => setToasts([]), []);

  const update = useCallback(
    (id: string, patch: Partial<Omit<ToastOptions, 'id'>>) => {
      setToasts((current) =>
        current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
    },
    [],
  );

  const toast = useCallback((options: ToastOptions) => {
    const id = options.id ?? `kw-toast-${++nextId.current}`;
    setToasts((current) => {
      const existing = current.findIndex((item) => item.id === id);
      if (existing === -1)
        return [...current, { tone: 'info', ...options, id }];
      return current.map((item, index) =>
        index === existing ? { ...item, ...options, id } : item,
      );
    });
    return id;
  }, []);

  const controller = useMemo(
    () => ({ toast, update, dismiss, dismissAll }),
    [dismiss, dismissAll, toast, update],
  );

  return (
    <ToastContext.Provider value={controller}>
      <ToastPrimitive.Provider
        duration={duration}
        swipeDirection="right"
        label={label}
      >
        {children}
        {toasts.slice(0, visibleLimit).map((item) => {
          const tone = item.tone ?? 'info';
          const ToneIcon = toastIcons[tone];
          return (
            <ToastPrimitive.Root
              key={item.id}
              className="kw-toast"
              data-tone={tone}
              data-motion-level={level}
              duration={
                item.duration ??
                (item.tone === 'loading' ? Number.POSITIVE_INFINITY : duration)
              }
              type={item.tone === 'danger' ? 'foreground' : 'background'}
              open
              onOpenChange={(open) => {
                if (!open) dismiss(item.id);
              }}
            >
              <span className="kw-toast__marker" aria-hidden="true">
                <ToneIcon size={18} strokeWidth={1.8} />
              </span>
              <div className="kw-toast__content">
                <ToastPrimitive.Title className="kw-toast__title">
                  {item.title}
                </ToastPrimitive.Title>
                {item.description ? (
                  <ToastPrimitive.Description className="kw-toast__description">
                    {item.description}
                  </ToastPrimitive.Description>
                ) : null}
              </div>
              {item.action ? (
                <ToastPrimitive.Action asChild altText={item.action.label}>
                  <button
                    className="kw-toast__action"
                    type="button"
                    onClick={() => {
                      item.action?.onClick();
                      dismiss(item.id);
                    }}
                  >
                    {item.action.label}
                  </button>
                </ToastPrimitive.Action>
              ) : null}
              <ToastPrimitive.Close asChild>
                <button
                  className="kw-toast__close"
                  type="button"
                  aria-label={dismissLabel}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          );
        })}
        <ToastPrimitive.Viewport className="kw-toast-viewport" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastController {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
