import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/Button/Button';
import { ConfirmationPage } from './ConfirmationPage';

const meta = {
  title: 'Patterns/ConfirmationPage',
  component: ConfirmationPage,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    title: 'Çalışma alanını oluştur?',
    description:
      'Bu bilgilerle yeni bir çalışma alanı ve ilk takım davetleri oluşturulacak.',
    details: <span>Kaiwen Workspace · 4 takım üyesi · Türkçe</span>,
    primaryAction: <Button>Onayla ve oluştur</Button>,
    secondaryAction: <Button variant="outline">Düzenlemeye dön</Button>,
  },
} satisfies Meta<typeof ConfirmationPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutDetails: Story = { args: { details: undefined } };
