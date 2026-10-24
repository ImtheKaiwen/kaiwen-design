import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button';
import { Alert } from './Alert';

describe('Alert', () => {
  it('uses assertive semantics for danger feedback', () => {
    render(
      <Alert tone="danger" title="Yükleme başarısız">
        Bağlantınızı kontrol edip yeniden deneyin.
      </Alert>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Yükleme başarısızBağlantınızı kontrol edip yeniden deneyin.',
    );
  });

  it('supports a keyboard-accessible contextual action', async () => {
    const onClick = vi.fn();
    render(
      <Alert
        tone="warning"
        title="Oturum sona ermek üzere"
        action={<Button onClick={onClick}>Uzat</Button>}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Uzat' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
