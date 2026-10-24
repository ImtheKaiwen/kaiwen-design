import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Drawer, DrawerContent, DrawerHeader, type DrawerSide } from './Drawer';

describe('Drawer', () => {
  it.each<DrawerSide>(['left', 'right', 'top', 'bottom'])(
    'exposes the %s side and closes with Escape',
    async (side) => {
      const user = userEvent.setup();
      render(
        <Drawer
          side={side}
          defaultOpen
          closeLabel="Close drawer"
          floating={side === 'bottom'}
        >
          <DrawerHeader title={`${side} drawer`} description="Drawer content" />
          <DrawerContent>Content</DrawerContent>
        </Drawer>,
      );
      const dialog = screen.getByRole('dialog', { name: `${side} drawer` });
      expect(dialog).toHaveAttribute('data-side', side);
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    },
  );
});
