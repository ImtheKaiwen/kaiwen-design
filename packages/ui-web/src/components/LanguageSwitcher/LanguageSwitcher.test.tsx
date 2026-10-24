import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from './LanguageSwitcher';

const options = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch', disabled: true },
];

describe('LanguageSwitcher', () => {
  it('uses accessible select semantics and reports locale changes', async () => {
    const onValueChange = vi.fn();
    render(
      <LanguageSwitcher
        label="Arayüz dili"
        options={options}
        defaultValue="tr"
        onValueChange={onValueChange}
      />,
    );
    const select = screen.getByRole('combobox', { name: 'Arayüz dili' });

    await userEvent.click(select);
    await userEvent.click(screen.getByRole('option', { name: 'English' }));
    expect(select).toHaveTextContent('English');
    expect(onValueChange).toHaveBeenCalledWith('en');
  });

  it('forwards disabled state and compact labels', () => {
    render(
      <LanguageSwitcher
        label="Dil"
        labelVisibility="sr-only"
        options={options}
        value="tr"
        disabled
      />,
    );

    const trigger = screen.getByRole('combobox', { name: 'Dil' });
    expect(trigger).toBeDisabled();
    expect(trigger.closest('.kw-select-field')).toHaveAttribute(
      'data-label-visibility',
      'sr-only',
    );
  });
});
