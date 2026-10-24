import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from './Drawer';

const meta = {
  title: 'Overlays/Drawer',
  component: Drawer,
  args: {
    closeLabel: 'Paneli kapat',
    side: 'right',
    trigger: <Button>Paneli aç</Button>,
    children: (
      <>
        <DrawerHeader
          title="Filtreler"
          description="Görünür sonuçları daraltın."
        />
        <DrawerContent>
          Takım, durum ve tarih filtreleri burada yaşar.
        </DrawerContent>
        <DrawerFooter>
          <Button variant="outline">Temizle</Button>
          <Button>Uygula</Button>
        </DrawerFooter>
      </>
    ),
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {};
export const Left: Story = { args: { side: 'left' } };
export const Top: Story = { args: { side: 'top' } };
export const BottomFloating: Story = {
  args: { side: 'bottom', floating: true },
};
