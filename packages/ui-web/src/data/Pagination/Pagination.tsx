import { forwardRef, type HTMLAttributes } from 'react';
import { ChevronLeft, ChevronRight } from '@imthekaiwen/icons';
import { Button } from '../../components/Button/Button';

export interface PaginationLabels {
  /** Accessible name for the pagination navigation landmark. */
  navigation: string;
  /** Visible and accessible previous-page action label. */
  previous: string;
  /** Visible and accessible next-page action label. */
  next: string;
  /** Localized current-page summary. */
  pageStatus: (page: number, pageCount: number) => string;
}

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current one-based page. */
  page: number;
  /** Total number of pages, with a minimum rendered value of one. */
  pageCount: number;
  /** Reports a requested one-based page. */
  onPageChange: (page: number) => void;
  /** Localized navigation and status labels. */
  labels: PaginationLabels;
  /** Prevents page changes while preserving the current status. */
  disabled?: boolean;
}

/** Compact previous/next pagination with a localized live page summary. */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    {
      page,
      pageCount,
      onPageChange,
      labels,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) {
    const safePageCount = Math.max(1, pageCount);
    const safePage = Math.min(Math.max(1, page), safePageCount);

    return (
      <nav
        {...props}
        ref={ref}
        aria-label={labels.navigation}
        className={['kw-pagination', className].filter(Boolean).join(' ')}
      >
        <Button
          size="sm"
          variant="ghost"
          disabled={disabled || safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
        >
          <ChevronLeft size={16} aria-hidden />
          {labels.previous}
        </Button>
        <span className="kw-pagination__status" aria-live="polite">
          {labels.pageStatus(safePage, safePageCount)}
        </span>
        <Button
          size="sm"
          variant="ghost"
          disabled={disabled || safePage >= safePageCount}
          onClick={() => onPageChange(safePage + 1)}
        >
          {labels.next}
          <ChevronRight size={16} aria-hidden />
        </Button>
      </nav>
    );
  },
);
