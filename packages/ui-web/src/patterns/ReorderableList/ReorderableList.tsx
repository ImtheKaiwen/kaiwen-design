import {
  forwardRef,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { Reorder, useDragControls, type MotionStyle } from 'motion/react';
import { ArrowDown, ArrowUp, GripVertical } from '@imthekaiwen/icons';
import { useMotionPolicy, type MotionPreference } from '@imthekaiwen/motion';
import { Button } from '../../components/Button/Button';

export interface ReorderableListItem {
  /** Stable identifier used for controlled reordering. */
  id: string;
  /** Visible primary item content. */
  label: ReactNode;
  /** Plain localized name used by controls and announcements. */
  accessibleLabel: string;
  /** Optional supporting item content. */
  description?: ReactNode;
  /** Optional trailing metadata that does not own item actions. */
  meta?: ReactNode;
  /** Prevents this item from being dragged or moved. */
  disabled?: boolean;
}

export interface ReorderableListLabels {
  /** Accessible name for the ordered list. */
  list: string;
  /** Accessible drag-handle name. */
  grab: (item: ReorderableListItem) => string;
  /** Accessible move-up action name. */
  moveUp: (item: ReorderableListItem) => string;
  /** Accessible move-down action name. */
  moveDown: (item: ReorderableListItem) => string;
  /** Announcement emitted when keyboard reordering starts. */
  pickedUp: (
    item: ReorderableListItem,
    position: number,
    total: number,
  ) => string;
  /** Announcement emitted after an item changes position. */
  moved: (item: ReorderableListItem, position: number, total: number) => string;
  /** Announcement emitted after a reordered item is committed. */
  dropped: (
    item: ReorderableListItem,
    position: number,
    total: number,
  ) => string;
  /** Announcement emitted when keyboard reordering is cancelled. */
  cancelled: (item: ReorderableListItem) => string;
}

export interface ReorderableListProps {
  /** Controlled items in their current visual order. */
  items: readonly ReorderableListItem[];
  /** Receives the complete next ordered collection. */
  onReorder: (items: readonly ReorderableListItem[]) => void;
  /** Localized control names and live-region announcements. */
  labels: ReorderableListLabels;
  /** Prevents every reorder interaction. */
  disabled?: boolean;
  /** Overrides global motion without bypassing reduced-motion. */
  motion?: MotionPreference;
  /** Optional native list identifier. */
  id?: string;
  /** Additional class applied to the ordered list. */
  className?: string;
  /** Motion-compatible native list styles. */
  style?: MotionStyle;
}

interface ReorderableRowProps {
  item: ReorderableListItem;
  index: number;
  total: number;
  items: readonly ReorderableListItem[];
  labels: ReorderableListLabels;
  disabled: boolean;
  grabbed: boolean;
  dragging: boolean;
  motionLevel: ReturnType<typeof useMotionPolicy>['level'];
  transition: ReturnType<typeof useMotionPolicy>['preset']['transition'];
  onGrab: (item: ReorderableListItem) => void;
  onDrop: (item: ReorderableListItem) => void;
  onCancel: (item: ReorderableListItem) => void;
  onMove: (item: ReorderableListItem, targetIndex: number) => void;
  onPointerStateChange: (itemId: string | null) => void;
}

function reorderItems(
  items: readonly ReorderableListItem[],
  fromIndex: number,
  toIndex: number,
) {
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  if (!item) return items;
  next.splice(toIndex, 0, item);
  return next;
}

function ReorderableRow({
  item,
  index,
  total,
  items,
  labels,
  disabled,
  grabbed,
  dragging,
  motionLevel,
  transition,
  onGrab,
  onDrop,
  onCancel,
  onMove,
  onPointerStateChange,
}: ReorderableRowProps) {
  const dragControls = useDragControls();
  const unavailable = disabled || item.disabled === true;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (unavailable) return;
    const isActivationKey =
      event.key === ' ' || event.key === 'Space' || event.key === 'Enter';
    if (!grabbed && isActivationKey) {
      event.preventDefault();
      onGrab(item);
      return;
    }
    if (!grabbed) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel(item);
      return;
    }
    if (isActivationKey) {
      event.preventDefault();
      onDrop(item);
      return;
    }
    const targetIndex =
      event.key === 'ArrowUp'
        ? index - 1
        : event.key === 'ArrowDown'
          ? index + 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? total - 1
              : null;
    if (targetIndex === null) return;
    event.preventDefault();
    onMove(item, Math.min(total - 1, Math.max(0, targetIndex)));
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (unavailable || (event.pointerType === 'mouse' && event.button !== 0))
      return;
    onPointerStateChange(item.id);
    dragControls.start(event);
  };

  return (
    <Reorder.Item
      as="li"
      value={item.id}
      className="kw-reorderable-list__item"
      data-disabled={unavailable || undefined}
      data-dragging={dragging || undefined}
      data-grabbed={grabbed || undefined}
      dragListener={false}
      dragControls={dragControls}
      dragElastic={
        motionLevel === 'expressive'
          ? 0.14
          : motionLevel === 'balanced'
            ? 0.08
            : 0
      }
      {...(motionLevel === 'off' ? {} : { layout: 'position' as const })}
      transition={motionLevel === 'off' ? { duration: 0 } : transition}
      {...(motionLevel === 'off' ? {} : { whileDrag: { scale: 1.015 } })}
      onDragStart={() => onPointerStateChange(item.id)}
      onDragEnd={() => {
        onPointerStateChange(null);
        onDrop(item);
      }}
    >
      <button
        type="button"
        className="kw-reorderable-list__handle"
        aria-label={labels.grab(item)}
        aria-pressed={grabbed}
        disabled={unavailable}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={() => {
          if (!dragging) onPointerStateChange(null);
        }}
        onPointerCancel={() => onPointerStateChange(null)}
      >
        <GripVertical size={18} aria-hidden />
      </button>
      <div className="kw-reorderable-list__content">
        <strong>{item.label}</strong>
        {item.description ? <span>{item.description}</span> : null}
      </div>
      {item.meta ? (
        <span className="kw-reorderable-list__meta">{item.meta}</span>
      ) : null}
      <div className="kw-reorderable-list__actions">
        <Button
          size="sm"
          variant="ghost"
          aria-label={labels.moveUp(item)}
          disabled={unavailable || index === 0}
          onClick={() => onMove(item, index - 1)}
        >
          <ArrowUp size={16} aria-hidden />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          aria-label={labels.moveDown(item)}
          disabled={unavailable || index === items.length - 1}
          onClick={() => onMove(item, index + 1)}
        >
          <ArrowDown size={16} aria-hidden />
        </Button>
      </div>
    </Reorder.Item>
  );
}

/** Controlled sortable list with pointer, touch, keyboard and explicit move controls. */
export const ReorderableList = forwardRef<
  HTMLOListElement,
  ReorderableListProps
>(function ReorderableList(
  {
    items,
    onReorder,
    labels,
    disabled = false,
    motion: motionOverride = 'inherit',
    id,
    className,
    style,
  },
  ref,
) {
  const { level, preset } = useMotionPolicy(motionOverride);
  const [grabbedId, setGrabbedId] = useState<string | null>(null);
  const [pointerItemId, setPointerItemId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const snapshotRef = useRef<readonly ReorderableListItem[]>([]);
  const itemMap = new Map(items.map((item) => [item.id, item]));

  const announcePosition = (
    item: ReorderableListItem,
    nextItems: readonly ReorderableListItem[],
  ) => {
    const position = nextItems.findIndex((entry) => entry.id === item.id) + 1;
    setAnnouncement(labels.moved(item, position, nextItems.length));
  };

  const moveItem = (item: ReorderableListItem, targetIndex: number) => {
    const currentIndex = items.findIndex((entry) => entry.id === item.id);
    if (currentIndex < 0 || currentIndex === targetIndex) return;
    const nextItems = reorderItems(items, currentIndex, targetIndex);
    onReorder(nextItems);
    announcePosition(item, nextItems);
  };

  const commitDrop = (item: ReorderableListItem) => {
    const position = items.findIndex((entry) => entry.id === item.id) + 1;
    setGrabbedId(null);
    setAnnouncement(labels.dropped(item, position, items.length));
  };

  return (
    <>
      <Reorder.Group
        ref={ref}
        id={id}
        {...(style ? { style } : {})}
        as="ol"
        axis="y"
        values={items.map((item) => item.id)}
        onReorder={(orderedIds) => {
          const nextItems = orderedIds.flatMap((id) => {
            const item = itemMap.get(id);
            return item ? [item] : [];
          });
          onReorder(nextItems);
          const activeItem = pointerItemId
            ? itemMap.get(pointerItemId)
            : undefined;
          if (activeItem) announcePosition(activeItem, nextItems);
        }}
        className={['kw-reorderable-list', className].filter(Boolean).join(' ')}
        aria-label={labels.list}
        data-disabled={disabled || undefined}
        data-motion-level={level}
      >
        {items.map((item, index) => (
          <ReorderableRow
            key={item.id}
            item={item}
            index={index}
            total={items.length}
            items={items}
            labels={labels}
            disabled={disabled}
            grabbed={grabbedId === item.id}
            dragging={pointerItemId === item.id}
            motionLevel={level}
            transition={preset.transition}
            onGrab={(activeItem) => {
              snapshotRef.current = items;
              setGrabbedId(activeItem.id);
              setAnnouncement(
                labels.pickedUp(activeItem, index + 1, items.length),
              );
            }}
            onDrop={commitDrop}
            onCancel={(activeItem) => {
              onReorder(snapshotRef.current);
              setGrabbedId(null);
              setAnnouncement(labels.cancelled(activeItem));
            }}
            onMove={moveItem}
            onPointerStateChange={setPointerItemId}
          />
        ))}
      </Reorder.Group>
      <p
        className="kw-sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </p>
    </>
  );
});
