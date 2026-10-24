import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DataTable, type DataTableColumn } from './DataTable';

type Project = {
  id: string;
  name: string;
  owner: string;
  updated: string;
  members: number;
};

const rows: Project[] = [
  {
    id: 'kw-1042',
    name: 'Kaiwen Workspace',
    owner: 'Deniz Kaya',
    updated: '24 Ekim 2026',
    members: 18,
  },
  {
    id: 'kw-1043',
    name: 'Uzun Türkçe çalışma alanı ve araştırma arşivi',
    owner: 'Ece Yılmaz',
    updated: '21 Ekim 2026',
    members: 7,
  },
  {
    id: 'kw-1044',
    name: 'Agent Lab',
    owner: 'Mert Demir',
    updated: '18 Ekim 2026',
    members: 24,
  },
];

const columns: DataTableColumn<Project>[] = [
  {
    id: 'name',
    label: 'Proje',
    cell: (row) => <strong>{row.name}</strong>,
    sortable: true,
    sortValue: (row) => row.name,
    size: 'wide',
  },
  { id: 'owner', label: 'Sahip', cell: (row) => row.owner },
  {
    id: 'members',
    label: 'Üye',
    cell: (row) => row.members,
    sortable: true,
    sortValue: (row) => row.members,
    align: 'end',
    size: 'compact',
  },
  {
    id: 'updated',
    label: 'Son güncelleme',
    cell: (row) => row.updated,
  },
];

const labels = {
  sortAscending: 'Artan sırala',
  sortDescending: 'Azalan sırala',
  loading: 'Projeler yükleniyor',
  scrollRegion: 'Proje tablosu kaydırma alanı',
};

const paginationLabels = {
  navigation: 'Proje sayfaları',
  previous: 'Önceki',
  next: 'Sonraki',
  pageStatus: (page: number, pageCount: number) =>
    `${page} / ${pageCount}. sayfa`,
};

function SelectableDemo() {
  const [selected, setSelected] = useState<readonly string[]>(['kw-1042']);
  return (
    <DataTable<Project>
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      caption="Son projeler"
      labels={labels}
      emptyState="Henüz proje yok."
      selection={{
        value: selected,
        onValueChange: setSelected,
        getRowLabel: (row) => `${row.name} projesini seç`,
        selectAllLabel: 'Tüm projeleri seç',
        clearAllLabel: 'Tüm proje seçimlerini kaldır',
        isRowSelectable: (row) => row.id !== 'kw-1044',
      }}
    />
  );
}

function PaginatedDemo() {
  const [page, setPage] = useState(1);
  return (
    <DataTable<Project>
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      caption="Son projeler"
      labels={labels}
      emptyState="Henüz proje yok."
      pagination={{
        page,
        pageSize: 2,
        onPageChange: setPage,
        labels: paginationLabels,
      }}
    />
  );
}

const meta = {
  title: 'Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  args: {
    columns,
    rows,
    getRowId: (row: Project) => row.id,
    caption: 'Son projeler',
    labels,
    emptyState: 'Henüz proje yok.',
  },
} satisfies Meta<typeof DataTable<Project>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const VisibleCaption: Story = {
  args: { captionVisibility: 'visible' },
};
export const Loading: Story = { args: { loading: true, loadingRows: 4 } };
export const Empty: Story = { args: { rows: [] } };
export const MobileOverflow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
export const Selectable: Story = {
  render: () => <SelectableDemo />,
};
export const Paginated: Story = { render: () => <PaginatedDemo /> };
