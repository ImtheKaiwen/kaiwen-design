import {
  forwardRef,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { ChevronDown } from '@imthekaiwen/icons';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Skeleton } from '../../components/Skeleton/Skeleton';
import { useKaiwenPreferences } from '../../providers/KaiwenProvider';
import { Pagination, type PaginationLabels } from '../Pagination/Pagination';

export type DataTableSortDirection = 'ascending' | 'descending';

export interface DataTableSort {
  /** Column identifier currently used for sorting. */
  columnId: string;
  /** Active semantic sort direction. */
  direction: DataTableSortDirection;
}

interface DataTableColumnBase<Row> {
  /** Stable column identifier. */
  id: string;
  /** Plain-text label used by assistive and sorting controls. */
  label: string;
  /** Optional richer visible header; `label` remains the accessible name. */
  header?: ReactNode;
  /** Renders the cell value for one row. */
  cell: (row: Row) => ReactNode;
  /** Semantic alignment for this column. */
  align?: 'start' | 'center' | 'end';
  /** Token-backed minimum width category. */
  size?: 'compact' | 'default' | 'wide';
}

export type DataTableColumn<Row> = DataTableColumnBase<Row> &
  (
    | {
        /** Enables sorting and requires a primitive sort value. */
        sortable: true;
        sortValue: (row: Row) => string | number | null | undefined;
      }
    | {
        sortable?: false;
        sortValue?: never;
      }
  );

export interface DataTableLabels {
  /** Appended to a column label when activating ascending order. */
  sortAscending: string;
  /** Appended to a column label when activating descending order. */
  sortDescending: string;
  /** Accessible label announced while placeholder rows are visible. */
  loading: string;
  /** Accessible name for the horizontally scrollable region. */
  scrollRegion: string;
}

export interface DataTableSelection<Row> {
  /** Controlled collection of selected row identifiers. */
  value?: readonly string[];
  /** Initial selected identifiers for uncontrolled usage. */
  defaultValue?: readonly string[];
  /** Reports the complete selected identifier collection. */
  onValueChange?: (rowIds: readonly string[]) => void;
  /** Returns the accessible selection label for one row. */
  getRowLabel: (row: Row) => string;
  /** Accessible label used when all available rows can be selected. */
  selectAllLabel: string;
  /** Accessible label used when all available rows can be cleared. */
  clearAllLabel: string;
  /** Optionally prevents selection for individual rows. */
  isRowSelectable?: (row: Row) => boolean;
}

interface DataTablePaginationBase {
  /** Number of rows represented by one page. */
  pageSize: number;
  /** Controlled one-based page. */
  page?: number;
  /** Initial one-based page for uncontrolled usage. */
  defaultPage?: number;
  /** Reports requested one-based page changes. */
  onPageChange?: (page: number) => void;
  /** Localized pagination labels. */
  labels: PaginationLabels;
}

export type DataTablePagination = DataTablePaginationBase &
  (
    | {
        /** Sorts and slices the supplied complete row collection. */
        mode?: 'client';
        totalRows?: never;
      }
    | {
        /** Treats supplied rows as an externally loaded page. */
        mode: 'manual';
        /** Total remote row count used to calculate the page count. */
        totalRows: number;
      }
  );

export interface DataTableProps<Row> {
  /** Column definitions shared across header and row rendering. */
  columns: readonly DataTableColumn<Row>[];
  /** Product-owned row data. */
  rows: readonly Row[];
  /** Returns a stable identifier for each row. */
  getRowId: (row: Row) => string;
  /** Accessible table caption. */
  caption: ReactNode;
  /** Controls whether the caption is visually displayed. */
  captionVisibility?: 'visible' | 'sr-only';
  /** Localized interaction labels. */
  labels: DataTableLabels;
  /** Controlled sort state. */
  sort?: DataTableSort | undefined;
  /** Initial sort state for uncontrolled use. */
  defaultSort?: DataTableSort | undefined;
  /** Reports sort changes. */
  onSortChange?: ((sort: DataTableSort) => void) | undefined;
  /** Optional controlled or uncontrolled row-selection contract. */
  selection?: DataTableSelection<Row>;
  /** Optional client-side or manually loaded pagination contract. */
  pagination?: DataTablePagination;
  /** Replaces body rows with geometry-preserving skeletons. */
  loading?: boolean;
  /** Number of placeholder rows rendered while loading. */
  loadingRows?: number;
  /** Persistent empty content rendered inside the table geometry. */
  emptyState: ReactNode;
  className?: string;
}

function compareValues(
  left: string | number | null | undefined,
  right: string | number | null | undefined,
  locale: string,
) {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;
  if (typeof left === 'number' && typeof right === 'number')
    return left - right;
  return String(left).localeCompare(String(right), locale, {
    numeric: true,
    sensitivity: 'base',
  });
}

function DataTableInner<Row>(
  {
    columns,
    rows,
    getRowId,
    caption,
    captionVisibility = 'sr-only',
    labels,
    sort,
    defaultSort,
    onSortChange,
    selection,
    pagination,
    loading = false,
    loadingRows = 5,
    emptyState,
    className,
  }: DataTableProps<Row>,
  ref: Ref<HTMLTableElement>,
) {
  const [internalSort, setInternalSort] = useState<DataTableSort | undefined>(
    defaultSort,
  );
  const [internalSelection, setInternalSelection] = useState<readonly string[]>(
    selection?.defaultValue ?? [],
  );
  const [internalPage, setInternalPage] = useState(
    pagination?.defaultPage ?? 1,
  );
  const activeSort = sort ?? internalSort;
  const selectedIds = selection?.value ?? internalSelection;
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const { locale } = useKaiwenPreferences();

  const sortedRows = useMemo(() => {
    if (!activeSort) return rows;
    const column = columns.find(
      (candidate) => candidate.id === activeSort.columnId,
    );
    if (!column?.sortable) return rows;
    const multiplier = activeSort.direction === 'ascending' ? 1 : -1;
    return rows
      .map((row, index) => ({ row, index }))
      .sort((left, right) => {
        const comparison = compareValues(
          column.sortValue(left.row),
          column.sortValue(right.row),
          locale,
        );
        return comparison === 0
          ? left.index - right.index
          : comparison * multiplier;
      })
      .map(({ row }) => row);
  }, [activeSort, columns, locale, rows]);

  const pageSize = Math.max(
    1,
    pagination?.pageSize ?? (sortedRows.length || 1),
  );
  const totalRows =
    pagination?.mode === 'manual'
      ? Math.max(0, pagination.totalRows)
      : sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const requestedPage = pagination?.page ?? internalPage;
  const activePage = Math.min(Math.max(1, requestedPage), pageCount);
  const visibleRows = useMemo(() => {
    if (!pagination || pagination.mode === 'manual') return sortedRows;
    const start = (activePage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [activePage, pageSize, pagination, sortedRows]);

  const selectableIds = useMemo(
    () =>
      visibleRows
        .filter((row) => selection?.isRowSelectable?.(row) !== false)
        .map(getRowId),
    [getRowId, selection, visibleRows],
  );
  const selectedSelectableCount = selectableIds.filter((id) =>
    selectedIdSet.has(id),
  ).length;
  const allRowsSelected =
    selectableIds.length > 0 &&
    selectedSelectableCount === selectableIds.length;
  const someRowsSelected = selectedSelectableCount > 0 && !allRowsSelected;

  const updateSelection = (next: readonly string[]) => {
    if (!selection) return;
    if (selection.value === undefined) setInternalSelection(next);
    selection.onValueChange?.(next);
  };

  const toggleRow = (rowId: string, checked: boolean) => {
    const next = checked
      ? [...selectedIds.filter((id) => id !== rowId), rowId]
      : selectedIds.filter((id) => id !== rowId);
    updateSelection(next);
  };

  const toggleAllRows = (checked: boolean) => {
    const selectableIdSet = new Set(selectableIds);
    const preserved = selectedIds.filter((id) => !selectableIdSet.has(id));
    updateSelection(checked ? [...preserved, ...selectableIds] : preserved);
  };

  const updatePage = (nextPage: number) => {
    if (!pagination) return;
    const boundedPage = Math.min(Math.max(1, nextPage), pageCount);
    if (pagination.page === undefined) setInternalPage(boundedPage);
    pagination.onPageChange?.(boundedPage);
  };

  const updateSort = (column: DataTableColumn<Row>) => {
    if (!column.sortable) return;
    const nextSort: DataTableSort = {
      columnId: column.id,
      direction:
        activeSort?.columnId === column.id &&
        activeSort.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    };
    if (sort === undefined) setInternalSort(nextSort);
    onSortChange?.(nextSort);
    if (pagination && activePage !== 1) updatePage(1);
  };

  return (
    <div
      className={['kw-data-table', className].filter(Boolean).join(' ')}
      data-loading={loading || undefined}
    >
      <div
        className="kw-data-table__scroll"
        role="region"
        aria-label={labels.scrollRegion}
        tabIndex={0}
      >
        <table ref={ref} aria-busy={loading || undefined}>
          <caption data-visibility={captionVisibility}>{caption}</caption>
          <thead>
            <tr>
              {selection ? (
                <th className="kw-data-table__selection" scope="col">
                  <Checkbox
                    checked={
                      allRowsSelected
                        ? true
                        : someRowsSelected
                          ? 'indeterminate'
                          : false
                    }
                    disabled={selectableIds.length === 0}
                    label={
                      allRowsSelected
                        ? selection.clearAllLabel
                        : selection.selectAllLabel
                    }
                    labelVisibility="sr-only"
                    onCheckedChange={toggleAllRows}
                  />
                </th>
              ) : null}
              {columns.map((column) => {
                const currentDirection =
                  activeSort?.columnId === column.id
                    ? activeSort.direction
                    : undefined;
                const nextDirection =
                  currentDirection === 'ascending' ? 'descending' : 'ascending';
                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={
                      column.sortable ? (currentDirection ?? 'none') : undefined
                    }
                    data-align={column.align ?? 'start'}
                    data-size={column.size ?? 'default'}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => updateSort(column)}
                        aria-label={`${column.label}: ${
                          nextDirection === 'ascending'
                            ? labels.sortAscending
                            : labels.sortDescending
                        }`}
                      >
                        <span>{column.header ?? column.label}</span>
                        <ChevronDown
                          size={15}
                          aria-hidden
                          data-direction={currentDirection}
                        />
                      </button>
                    ) : (
                      (column.header ?? column.label)
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from(
                  { length: Math.max(1, loadingRows) },
                  (_, rowIndex) => (
                    <tr key={`loading-${rowIndex}`} aria-label={labels.loading}>
                      {selection ? (
                        <td className="kw-data-table__selection">
                          <Skeleton width="20px" aria-hidden />
                        </td>
                      ) : null}
                      {columns.map((column, columnIndex) => (
                        <td
                          key={column.id}
                          data-align={column.align ?? 'start'}
                          data-size={column.size ?? 'default'}
                        >
                          <Skeleton
                            width={columnIndex === 0 ? '72%' : '58%'}
                            aria-hidden
                          />
                        </td>
                      ))}
                    </tr>
                  ),
                )
              : visibleRows.map((row) => {
                  const rowId = getRowId(row);
                  const rowSelectable =
                    selection?.isRowSelectable?.(row) !== false;
                  return (
                    <tr
                      key={rowId}
                      data-selected={selectedIdSet.has(rowId) || undefined}
                    >
                      {selection ? (
                        <td className="kw-data-table__selection">
                          <Checkbox
                            checked={selectedIdSet.has(rowId)}
                            disabled={!rowSelectable}
                            label={selection.getRowLabel(row)}
                            labelVisibility="sr-only"
                            onCheckedChange={(next) => toggleRow(rowId, next)}
                          />
                        </td>
                      ) : null}
                      {columns.map((column) => (
                        <td
                          key={column.id}
                          data-align={column.align ?? 'start'}
                          data-size={column.size ?? 'default'}
                        >
                          {column.cell(row)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
            {!loading && visibleRows.length === 0 ? (
              <tr>
                <td
                  className="kw-data-table__empty"
                  colSpan={columns.length + (selection ? 1 : 0)}
                >
                  {emptyState}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {pagination ? (
        <Pagination
          page={activePage}
          pageCount={pageCount}
          onPageChange={updatePage}
          labels={pagination.labels}
          disabled={loading}
        />
      ) : null}
    </div>
  );
}

/** Semantic, sortable data table with stable loading and overflow behavior. */
export const DataTable = forwardRef(DataTableInner) as <Row>(
  props: DataTableProps<Row> & { ref?: Ref<HTMLTableElement> },
) => ReactElement;
