import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { value: 'standard', label: 'Standard', description: 'Dengeli işlem' },
  { value: 'fast', label: 'Fast', description: 'Daha hızlı işlem' },
  { value: 'legacy', label: 'Legacy', disabled: true },
];

describe('Select', () => {
  it('opens with the keyboard and reports a selected option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select
        label="Servis katmanı"
        options={options}
        defaultValue="standard"
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole('combobox', { name: 'Servis katmanı' });
    await user.click(trigger);
    expect(screen.getByRole('option', { name: /Standard/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await user.click(screen.getByRole('option', { name: /Fast/ }));
    expect(onValueChange).toHaveBeenCalledWith('fast');
    expect(trigger).toHaveTextContent('Fast');
  });

  it('supports disabled fields and disabled options', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Select label="Katman" options={options} defaultValue="standard" />,
    );
    await user.click(screen.getByRole('combobox', { name: 'Katman' }));
    expect(screen.getByRole('option', { name: 'Legacy' })).toHaveAttribute(
      'data-disabled',
    );
    await user.keyboard('{Escape}');

    rerender(
      <Select
        label="Katman"
        options={options}
        defaultValue="standard"
        disabled
      />,
    );
    expect(screen.getByRole('combobox', { name: 'Katman' })).toBeDisabled();
  });
});
