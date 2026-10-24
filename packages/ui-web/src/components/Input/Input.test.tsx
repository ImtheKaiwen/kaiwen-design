import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('associates its label and supporting description', () => {
    render(<Input label="Proje adı" description="En fazla 80 karakter." />);
    const input = screen.getByRole('textbox', { name: 'Proje adı' });
    expect(input).toHaveAccessibleDescription('En fazla 80 karakter.');
  });

  it('reports validation errors through native semantics', () => {
    render(
      <Input label="E-posta" errorText="Geçerli bir e-posta adresi girin." />,
    );
    const input = screen.getByRole('textbox', { name: 'E-posta' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(
      'Geçerli bir e-posta adresi girin.',
    );
  });

  it('supports controlled values and preserves the native change event', async () => {
    const onChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Input
        label="Arama"
        value=""
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'Arama' }), 'K');
    expect(onChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith('K');
  });

  it('uses the native disabled state', () => {
    render(<Input label="Salt okunur alan" disabled />);
    expect(
      screen.getByRole('textbox', { name: 'Salt okunur alan' }),
    ).toBeDisabled();
  });
});
