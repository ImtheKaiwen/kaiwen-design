import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../../components/Card/Card';
import { Stack } from '../Stack/Stack';
import { Container } from './Container';

const longCopy =
  'Uzun Türkçe içerikler, bağlantılar ve yerelleştirilmiş başlıklar dar ekranlarda yatay taşma üretmeden okunabilir bir satır uzunluğunda kalır.';

const meta = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  args: {
    maxWidth: 'content',
    padding: 'responsive',
    children: (
      <Card surface="subtle">
        <Stack gap="8">
          <strong>Okunabilir içerik alanı</strong>
          <span>{longCopy}</span>
        </Stack>
      </Card>
    ),
  },
  argTypes: {
    maxWidth: {
      control: 'select',
      options: ['narrow', 'content', 'wide', 'full'],
    },
    padding: {
      control: 'select',
      options: [
        'responsive',
        '0',
        '8',
        '12',
        '16',
        '20',
        '24',
        '32',
        '40',
        '48',
        '64',
      ],
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Narrow: Story = { args: { maxWidth: 'narrow' } };
export const Fluid: Story = { args: { maxWidth: 'full' } };
export const LongTurkishContent: Story = {
  args: {
    children: (
      <Card>
        <code>
          https://example.com/cok-uzun-ve-bosluk-icermeyen-bir-kaynak-kimligi-1234567890
        </code>
        <p>{longCopy.repeat(2)}</p>
      </Card>
    ),
  },
};
