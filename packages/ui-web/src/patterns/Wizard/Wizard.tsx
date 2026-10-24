import {
  forwardRef,
  useId,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Check } from '@imthekaiwen/icons';
import { Button } from '../../components/Button/Button';

export interface WizardStep {
  /** Stable identifier used by the controlled active-step API. */
  id: string;
  /** User-facing step name. */
  label: ReactNode;
  /** Optional supporting context shown in the step list. */
  description?: ReactNode;
  /** Marks a step as optional without changing validation behavior. */
  optional?: boolean;
}

export interface WizardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  /** Ordered visible steps. Filter this array in the product for conditional flows. */
  steps: readonly WizardStep[];
  /** Identifier of the currently active step. */
  activeStep: string;
  /** Controlled step-change callback. Product state remains the source of truth. */
  onStepChange: (stepId: string) => void;
  /** Current step content. Form state should be owned above the Wizard. */
  children: ReactNode;
  /** Validates the current step before forward navigation. Return false to stay put. */
  validateStep?: (step: WizardStep) => boolean | Promise<boolean>;
  /** Final submission callback. Repeated activation is blocked while it is pending. */
  onComplete: () => void | Promise<void>;
  /** Visible label for the step-navigation landmark. */
  stepsLabel: string;
  /** Localized progress text. */
  progressLabel: (current: number, total: number) => ReactNode;
  /** Localized accessible text appended to completed steps. */
  completedLabel: string;
  /** Localized accessible text appended to optional steps. */
  optionalLabel: string;
  /** Label for the back action. */
  backLabel: ReactNode;
  /** Label for the forward action. */
  nextLabel: ReactNode;
  /** Label for the final submit action. */
  completeLabel: ReactNode;
  /** Allows direct navigation to already visited steps. */
  allowStepNavigation?: boolean;
  /** External pending state, for controlled submission lifecycles. */
  busy?: boolean;
  /** Persistent product-supplied validation or submission error. */
  error?: ReactNode;
}

export const Wizard = forwardRef<HTMLDivElement, WizardProps>(function Wizard(
  {
    steps,
    activeStep,
    onStepChange,
    children,
    validateStep,
    onComplete,
    stepsLabel,
    progressLabel,
    completedLabel,
    optionalLabel,
    backLabel,
    nextLabel,
    completeLabel,
    allowStepNavigation = true,
    busy = false,
    error,
    className,
    ...props
  },
  ref,
) {
  const instanceId = useId();
  const [pending, setPending] = useState(false);
  const activeIndex = steps.findIndex((step) => step.id === activeStep);
  const currentStep = steps[activeIndex];
  const previousStep = steps[activeIndex - 1];
  const nextStep = steps[activeIndex + 1];
  const unavailable = busy || pending || !currentStep;
  const isLastStep = activeIndex === steps.length - 1;
  const panelId = `${instanceId}-panel`;

  const goForward = async () => {
    if (unavailable || !currentStep) return;
    setPending(true);
    try {
      const valid = await validateStep?.(currentStep);
      if (valid === false) return;
      if (isLastStep) await onComplete();
      else if (nextStep) onStepChange(nextStep.id);
    } finally {
      setPending(false);
    }
  };

  if (!currentStep) return null;

  return (
    <div
      {...props}
      ref={ref}
      className={['kw-wizard', className].filter(Boolean).join(' ')}
      aria-busy={unavailable || undefined}
    >
      <nav className="kw-wizard__navigation" aria-label={stepsLabel}>
        <p className="kw-wizard__progress" aria-live="polite">
          {progressLabel(activeIndex + 1, steps.length)}
        </p>
        <ol className="kw-wizard__steps">
          {steps.map((step, index) => {
            const state =
              index < activeIndex
                ? 'complete'
                : index === activeIndex
                  ? 'current'
                  : 'upcoming';
            const canNavigate =
              allowStepNavigation && index < activeIndex && !unavailable;
            const labelId = `${instanceId}-step-${index}`;
            return (
              <li key={step.id} data-state={state}>
                <button
                  id={labelId}
                  type="button"
                  className="kw-wizard__step"
                  aria-current={state === 'current' ? 'step' : undefined}
                  aria-controls={state === 'current' ? panelId : undefined}
                  disabled={!canNavigate}
                  onClick={() => onStepChange(step.id)}
                >
                  <span className="kw-wizard__step-marker" aria-hidden="true">
                    {state === 'complete' ? <Check size={16} /> : index + 1}
                  </span>
                  <span className="kw-wizard__step-copy">
                    <span className="kw-wizard__step-label">{step.label}</span>
                    {step.description || step.optional ? (
                      <span className="kw-wizard__step-description">
                        {step.description}
                        {step.description && step.optional ? (
                          <span aria-hidden="true"> · </span>
                        ) : null}
                        {step.optional ? (
                          <span className="kw-wizard__step-meta">
                            {optionalLabel}
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                    {state === 'complete' ? (
                      <span className="kw-sr-only"> {completedLabel}</span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div
        id={panelId}
        className="kw-wizard__panel"
        role="group"
        aria-labelledby={`${instanceId}-step-${activeIndex}`}
      >
        {children}
      </div>

      {error ? (
        <div className="kw-wizard__error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="kw-wizard__actions">
        <Button
          variant="outline"
          disabled={activeIndex === 0 || unavailable}
          onClick={() => {
            if (previousStep) onStepChange(previousStep.id);
          }}
        >
          {backLabel}
        </Button>
        <Button
          loading={pending}
          disabled={busy}
          onClick={() => void goForward()}
        >
          {isLastStep ? completeLabel : nextLabel}
        </Button>
      </div>
    </div>
  );
});
