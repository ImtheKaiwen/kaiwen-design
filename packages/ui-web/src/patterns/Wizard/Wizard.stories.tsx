import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '../../components/Input/Input';
import { Stack } from '../../primitives/Stack/Stack';
import { Wizard, type WizardStep } from './Wizard';

const steps: WizardStep[] = [
  { id: 'workspace', label: 'Çalışma alanı', description: 'Temel bilgiler' },
  {
    id: 'team',
    label: 'Takım üyeleri',
    description: 'Davetleri hazırlayın',
    optional: true,
  },
  { id: 'review', label: 'İncele ve tamamla', description: 'Son kontrol' },
];

function WizardDemo({ long = false }: { long?: boolean }) {
  const [activeStep, setActiveStep] = useState('workspace');
  const [workspaceName, setWorkspaceName] = useState('Kaiwen Workspace');
  const activeIndex = steps.findIndex((step) => step.id === activeStep);
  return (
    <Wizard
      steps={
        long
          ? steps.map((step) => ({
              ...step,
              label: `${step.label} için uzun ve açıklayıcı Türkçe başlık`,
            }))
          : steps
      }
      activeStep={activeStep}
      onStepChange={setActiveStep}
      onComplete={() => undefined}
      stepsLabel="Çalışma alanı kurulum adımları"
      progressLabel={(current, total) => `${total} adımdan ${current}. adım`}
      completedLabel="Tamamlandı"
      optionalLabel="İsteğe bağlı"
      backLabel="Geri"
      nextLabel="Devam"
      completeLabel="Kurulumu tamamla"
    >
      {activeIndex === 0 ? (
        <Input
          label="Çalışma alanı adı"
          value={workspaceName}
          onValueChange={setWorkspaceName}
        />
      ) : null}
      {activeIndex === 1 ? (
        <Input
          label="Davet edilecek e-posta"
          type="email"
          description="Bu adımı atlayabilirsiniz."
        />
      ) : null}
      {activeIndex === 2 ? (
        <Stack gap="8">
          <strong>Kurulum hazır</strong>
          <span>{workspaceName}</span>
        </Stack>
      ) : null}
    </Wizard>
  );
}

const meta = {
  title: 'Patterns/Wizard',
  component: Wizard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    steps,
    activeStep: 'workspace',
    onStepChange: () => undefined,
    onComplete: () => undefined,
    stepsLabel: 'Kurulum adımları',
    progressLabel: (current, total) => `${current} / ${total}`,
    completedLabel: 'Tamamlandı',
    optionalLabel: 'İsteğe bağlı',
    backLabel: 'Geri',
    nextLabel: 'Devam',
    completeLabel: 'Tamamla',
    children: <Input label="Çalışma alanı adı" />,
  },
} satisfies Meta<typeof Wizard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <WizardDemo /> };
export const LongTurkishContent: Story = { render: () => <WizardDemo long /> };
export const PersistentError: Story = {
  render: () => (
    <Wizard
      steps={steps}
      activeStep="workspace"
      onStepChange={() => undefined}
      onComplete={() => undefined}
      stepsLabel="Kurulum adımları"
      progressLabel={(current, total) => `${current} / ${total}`}
      completedLabel="Tamamlandı"
      optionalLabel="İsteğe bağlı"
      backLabel="Geri"
      nextLabel="Devam"
      completeLabel="Tamamla"
      error="Çalışma alanı adı daha önce kullanılmış. Başka bir ad seçin."
    >
      <Input
        label="Çalışma alanı adı"
        defaultValue="Kaiwen"
        errorText="Bu ad kullanılamıyor."
      />
    </Wizard>
  ),
};
