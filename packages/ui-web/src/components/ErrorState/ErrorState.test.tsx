import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('announces a persistent failure and supports retry', async () => {
    const retry = vi.fn();
    render(
      <ErrorState
        title="Projeler yüklenemedi"
        description="Bağlantınızı kontrol edin."
        action={<Button onClick={retry}>Yeniden dene</Button>}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Projeler yüklenemedi');
    await userEvent.click(screen.getByRole('button', { name: 'Yeniden dene' }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
