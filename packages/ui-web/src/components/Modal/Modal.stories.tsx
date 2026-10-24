import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Modal, ModalContent, ModalFooter, ModalHeader } from './Modal';

const meta = {
  title: 'Overlays/Modal',
  component: Modal,
  args: {
    closeLabel: 'Modalı kapat',
    trigger: <Button>Modalı aç</Button>,
    children: (
      <>
        <ModalHeader
          title="Projeyi arşivle"
          description="Bu işlem projeyi aktif çalışma alanından kaldırır."
        />
        <ModalContent>
          Arşivlenen projeyi daha sonra geri yükleyebilirsiniz.
        </ModalContent>
        <ModalFooter>
          <Button variant="outline">Vazgeç</Button>
          <Button>Arşivle</Button>
        </ModalFooter>
      </>
    ),
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Large: Story = { args: { size: 'lg' } };
export const ReducedMotion: Story = { args: { motion: 'off' } };
