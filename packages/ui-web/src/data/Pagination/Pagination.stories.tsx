import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

const labels = {
  navigation: 'Proje sayfaları',
  previous: 'Önceki',
  next: 'Sonraki',
  pageStatus: (page: number, pageCount: number) =>
    `${page} / ${pageCount}. sayfa`,
};

function ControlledPagination() {
  const [page, setPage] = useState(2);
  return (
    <Pagination
      page={page}
      pageCount={5}
      onPageChange={setPage}
      labels={labels}
    />
  );
}

const meta = {
  title: 'Data/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    page: 1,
    pageCount: 5,
    onPageChange: () => undefined,
    labels,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Controlled: Story = { render: () => <ControlledPagination /> };
export const LastPage: Story = { args: { page: 5 } };
export const SinglePage: Story = { args: { pageCount: 1 } };
export const Disabled: Story = { args: { page: 2, disabled: true } };
