import {
  forwardRef,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Button } from '../../components/Button/Button';
import { Progress } from '../../components/Progress/Progress';
import { Spinner } from '../../components/Spinner/Spinner';

export type UploadFileStatus = 'queued' | 'uploading' | 'success' | 'error';

export interface UploadFileItem {
  /** Stable identifier for actions and list rendering. */
  id: string;
  /** User-visible file name. */
  name: string;
  /** Product-formatted size or other secondary metadata. */
  meta?: ReactNode;
  /** Controlled lifecycle state. */
  status: UploadFileStatus;
  /** Measurable upload percentage. Omit when progress is unknown. */
  progress?: number;
  /** Accessible progress description, such as “2 MB / 5 MB”. */
  progressText?: string;
  /** Persistent product-supplied failure detail. */
  error?: ReactNode;
}

export interface UploadProgressLabels {
  /** File list landmark label. */
  fileList: string;
  /** Status label for a queued file. */
  queued: string;
  /** Status label for an active upload. */
  uploading: string;
  /** Status label for a completed upload. */
  success: string;
  /** Status label for a failed upload. */
  error: string;
  /** Visible cancel action text. */
  cancel: string;
  /** Visible retry action text. */
  retry: string;
  /** Visible remove action text. */
  remove: string;
}

export interface UploadProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  /** Visible heading for the upload control. */
  label: ReactNode;
  /** Accepted formats, limits, or other product guidance. */
  description?: ReactNode;
  /** Visible drag-and-drop instruction. */
  dropLabel: ReactNode;
  /** Native file-picker action label. */
  selectLabel: ReactNode;
  /** Controlled file lifecycle items. */
  files: readonly UploadFileItem[];
  /** Localized status and action labels. */
  labels: UploadProgressLabels;
  /** Native accepted file types. Validation remains product-owned. */
  accept?: string;
  /** Allows more than one file in the native picker. */
  multiple?: boolean;
  /** Prevents selection, drop, and row actions. */
  disabled?: boolean;
  /** Receives native picker or dropped files without uploading them. */
  onFilesSelected: (files: readonly File[]) => void;
  /** Cancels an active product upload. */
  onCancel?: (fileId: string) => void;
  /** Retries a failed product upload. */
  onRetry?: (fileId: string) => void;
  /** Removes a queued, completed, or failed file. */
  onRemove?: (fileId: string) => void;
}

function getStatusLabel(
  status: UploadFileStatus,
  labels: UploadProgressLabels,
) {
  return labels[status];
}

export const UploadProgress = forwardRef<HTMLDivElement, UploadProgressProps>(
  function UploadProgress(
    {
      label,
      description,
      dropLabel,
      selectLabel,
      files,
      labels,
      accept,
      multiple = true,
      disabled = false,
      onFilesSelected,
      onCancel,
      onRetry,
      onRemove,
      className,
      ...props
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const emitFiles = (fileList: FileList | null) => {
      if (disabled || !fileList?.length) return;
      onFilesSelected(Array.from(fileList));
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      emitFiles(event.currentTarget.files);
      event.currentTarget.value = '';
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled) {
        event.dataTransfer.dropEffect = 'copy';
        setDragActive(true);
      }
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null))
        setDragActive(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragActive(false);
      emitFiles(event.dataTransfer.files);
    };

    return (
      <div
        {...props}
        ref={ref}
        className={['kw-upload-progress', className].filter(Boolean).join(' ')}
        data-disabled={disabled || undefined}
      >
        <div className="kw-upload-progress__heading">
          <h3>{label}</h3>
          {description ? <p>{description}</p> : null}
        </div>

        <div
          className="kw-upload-progress__dropzone"
          data-drag-active={dragActive || undefined}
          onDragEnter={handleDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <span>{dropLabel}</span>
          <Button
            variant="outline"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            {selectLabel}
          </Button>
          <input
            ref={inputRef}
            type="file"
            hidden
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleInputChange}
          />
        </div>

        {files.length > 0 ? (
          <ul className="kw-upload-progress__list" aria-label={labels.fileList}>
            {files.map((file) => {
              const statusLabel = getStatusLabel(file.status, labels);
              return (
                <li
                  key={file.id}
                  className="kw-upload-progress__item"
                  data-status={file.status}
                >
                  <div className="kw-upload-progress__file">
                    <strong>{file.name}</strong>
                    {file.meta ? <span>{file.meta}</span> : null}
                  </div>

                  <div className="kw-upload-progress__state">
                    {file.status === 'uploading' &&
                    file.progress === undefined ? (
                      <span className="kw-upload-progress__indeterminate">
                        <Spinner size="sm" label={statusLabel} />
                        <span aria-hidden="true">{statusLabel}</span>
                      </span>
                    ) : null}
                    {file.status === 'uploading' &&
                    file.progress !== undefined ? (
                      <Progress
                        label={statusLabel}
                        value={file.progress}
                        {...(file.progressText === undefined
                          ? {}
                          : { valueText: file.progressText })}
                        showValue
                      />
                    ) : null}
                    {file.status !== 'uploading' ? (
                      <span className="kw-upload-progress__status">
                        {statusLabel}
                      </span>
                    ) : null}
                    {file.error ? (
                      <span className="kw-upload-progress__error" role="alert">
                        {file.error}
                      </span>
                    ) : null}
                  </div>

                  <div className="kw-upload-progress__actions">
                    {file.status === 'uploading' && onCancel ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={disabled}
                        onClick={() => onCancel(file.id)}
                      >
                        <span className="kw-sr-only">{file.name}: </span>
                        {labels.cancel}
                      </Button>
                    ) : null}
                    {file.status === 'error' && onRetry ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={disabled}
                        onClick={() => onRetry(file.id)}
                      >
                        <span className="kw-sr-only">{file.name}: </span>
                        {labels.retry}
                      </Button>
                    ) : null}
                    {file.status !== 'uploading' && onRemove ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={disabled}
                        onClick={() => onRemove(file.id)}
                      >
                        <span className="kw-sr-only">{file.name}: </span>
                        {labels.remove}
                      </Button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    );
  },
);
