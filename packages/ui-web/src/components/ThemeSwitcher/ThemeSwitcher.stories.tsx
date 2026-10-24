import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ThemePreference } from '@imthekaiwen/tokens';
import { Card } from '../Card/Card';
import { Stack } from '../../primitives/Stack/Stack';
import { KaiwenProvider } from '../../providers/KaiwenProvider';
import { ThemeSwitcher } from './ThemeSwitcher';

const labels = { light: 'Açık', dark: 'Koyu', system: 'Sistem' };

const meta = {
  title: 'Preferences/ThemeSwitcher',
  component: ThemeSwitcher,
  tags: ['autodocs'],
  args: { label: 'Tema tercihi', labels, defaultValue: 'system' },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { size: 'sm' } };
export const ExpressiveMotion: Story = { args: { motion: 'expressive' } };
export const Disabled: Story = { args: { disabled: true } };
export const LongTurkishLabels: Story = {
  args: {
    labels: {
      light: 'Açık görünüm',
      dark: 'Koyu görünüm',
      system: 'İşletim sistemi tercihini kullan',
    },
  },
};

function ThemePreview() {
  const [theme, setTheme] = useState<ThemePreference>('light');
  return (
    <KaiwenProvider theme={theme}>
      <Card>
        <Stack gap="16">
          <ThemeSwitcher
            label="Önizleme teması"
            labels={labels}
            value={theme}
            onValueChange={setTheme}
          />
          <span>Seçim provider temasına kontrollü olarak bağlandı.</span>
        </Stack>
      </Card>
    </KaiwenProvider>
  );
}

export const ProviderAdapter: Story = { render: () => <ThemePreview /> };
