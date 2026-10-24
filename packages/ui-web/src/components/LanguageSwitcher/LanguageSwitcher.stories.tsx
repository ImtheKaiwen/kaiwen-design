import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageSwitcher } from './LanguageSwitcher';

const options = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
];

const meta = {
  title: 'Preferences/LanguageSwitcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
  args: { label: 'Arayüz dili', options, defaultValue: 'tr' },
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CompactToolbar: Story = {
  args: { controlSize: 'sm', labelVisibility: 'sr-only' },
};
export const Disabled: Story = { args: { disabled: true } };
export const LongLanguageNames: Story = {
  args: {
    options: [
      { value: 'tr', label: 'Türkçe' },
      { value: 'az-Latn', label: 'Azərbaycan dili — latın qrafikası' },
    ],
  },
};

function ControlledPreview() {
  const [locale, setLocale] = useState('tr');
  return (
    <LanguageSwitcher
      label="Kontrollü dil seçimi"
      options={options}
      value={locale}
      onValueChange={setLocale}
    />
  );
}

export const Controlled: Story = { render: () => <ControlledPreview /> };
