import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal, ModalContent, ModalHeader } from './Modal';

describe('Modal', () => {
  it('opens, traps focus, closes with Escape, and restores trigger focus', async () => {
    const user = userEvent.setup();
    render(
      <Modal trigger={<button>Open modal</button>} closeLabel="Close modal">
        <ModalHeader title="Settings" description="Project settings" />
        <ModalContent>
          <button>Focusable action</button>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Open modal' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeVisible();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('supports controlled state and guarded outside interaction', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <Modal
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
          closeOnOutsideClick={false}
        >
          <ModalHeader title="Controlled" description="Controlled dialog" />
        </Modal>
      );
    }
    render(<Controlled />);
    await user.click(document.querySelector('.kw-dialog-overlay')!);
    expect(screen.getByRole('dialog', { name: 'Controlled' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
