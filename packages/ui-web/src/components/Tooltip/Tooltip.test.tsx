import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button/Button';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('opens from keyboard focus and closes with Escape', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Ayarları aç" delayDuration={0}>
        <Button>Ayarlar</Button>
      </Tooltip>,
    );
    await user.tab();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Ayarları aç');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Kısa açıklama" delayDuration={0}>
        <Button>Bilgi</Button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button', { name: 'Bilgi' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Kısa açıklama',
    );
  });
});
