import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '../../components/Input/Input';
import { Wizard, type WizardStep } from './Wizard';

const steps: WizardStep[] = [
  { id: 'workspace', label: 'Çalışma alanı' },
  { id: 'team', label: 'Takım', optional: true },
  { id: 'review', label: 'İncele' },
];

const labels = {
  stepsLabel: 'Kurulum adımları',
  progressLabel: (current: number, total: number) =>
    `${current}/${total}. adım`,
  completedLabel: 'Tamamlandı',
  optionalLabel: 'İsteğe bağlı',
  backLabel: 'Geri',
  nextLabel: 'Devam',
  completeLabel: 'Kurulumu tamamla',
};

function ControlledWizard({
  validateStep = vi.fn(() => true),
  onComplete = vi.fn(),
}) {
  const [step, setStep] = useState('workspace');
  const [name, setName] = useState('');
  return (
    <Wizard
      {...labels}
      steps={steps}
      activeStep={step}
      onStepChange={setStep}
      validateStep={validateStep}
      onComplete={onComplete}
    >
      {step === 'workspace' ? (
        <Input label="Çalışma alanı adı" value={name} onValueChange={setName} />
      ) : (
        <p>{step}</p>
      )}
    </Wizard>
  );
}

describe('Wizard', () => {
  it('exposes progress and preserves product-owned values when navigating back', async () => {
    const user = userEvent.setup();
    render(<ControlledWizard />);

    expect(
      screen.getByRole('navigation', { name: 'Kurulum adımları' }),
    ).toBeInTheDocument();
    expect(screen.getByText('1/3. adım')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Takım İsteğe bağlı' }),
    ).toBeDisabled();
    await user.type(
      screen.getByRole('textbox', { name: 'Çalışma alanı adı' }),
      'Kaiwen Agent',
    );
    await user.click(screen.getByRole('button', { name: 'Devam' }));
    expect(screen.getByText('2/3. adım')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Çalışma alanı Tamamlandı' }),
    ).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Geri' }));
    expect(
      screen.getByRole('textbox', { name: 'Çalışma alanı adı' }),
    ).toHaveValue('Kaiwen Agent');
  });

  it('does not advance when current-step validation fails', async () => {
    const user = userEvent.setup();
    const validateStep = vi.fn(() => false);
    render(<ControlledWizard validateStep={validateStep} />);
    await user.click(screen.getByRole('button', { name: 'Devam' }));
    expect(validateStep).toHaveBeenCalledWith(steps[0]!);
    expect(screen.getByText('1/3. adım')).toBeInTheDocument();
  });

  it('guards the final action while asynchronous completion is pending', async () => {
    const user = userEvent.setup();
    let resolveCompletion: (() => void) | undefined;
    const onComplete = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveCompletion = resolve;
        }),
    );
    render(
      <Wizard
        {...labels}
        steps={[steps[2]!]}
        activeStep="review"
        onStepChange={vi.fn()}
        onComplete={onComplete}
      >
        <p>Özet</p>
      </Wizard>,
    );

    const complete = screen.getByRole('button', { name: 'Kurulumu tamamla' });
    await user.click(complete);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(complete).toBeDisabled();
    await user.click(complete);
    expect(onComplete).toHaveBeenCalledTimes(1);
    resolveCompletion?.();
  });

  it('renders persistent product errors as alerts', () => {
    render(
      <Wizard
        {...labels}
        steps={steps}
        activeStep="workspace"
        onStepChange={vi.fn()}
        onComplete={vi.fn()}
        error="Bu adım tamamlanamadı."
      >
        <p>İçerik</p>
      </Wizard>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Bu adım tamamlanamadı.',
    );
  });
});
