import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, type DataTableColumn } from './DataTable';

type Project = { id: string; name: string; members: number; status: string };

const rows: Project[] = [
  { id: '1', name: 'Zeta', members: 4, status: 'Hazır' },
  { id: '2', name: 'Alfa', members: 12, status: 'İnceleniyor' },
];

const columns: DataTableColumn<Project>[] = [
  {
    id: 'name',
    label: 'Proje',
    cell: (row) => row.name,
    sortable: true,
    sortValue: (row) => row.name,
    size: 'wide',
  },
  {
    id: 'members',
    label: 'Üye',
    cell: (row) => row.members,
    sortable: true,
    sortValue: (row) => row.members,
    align: 'end',
    size: 'compact',
  },
  { id: 'status', label: 'Durum', cell: (row) => row.status },
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

describe('DataTable', () => {
  it('sorts rows with mouse and keyboard while exposing aria-sort', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        caption="Projeler"
        labels={labels}
        emptyState="Proje yok"
        onSortChange={onSortChange}
      />,
    );

    const sortButton = screen.getByRole('button', {
      name: 'Proje: Artan sırala',
    });
    await user.click(sortButton);
    expect(onSortChange).toHaveBeenCalledWith({
      columnId: 'name',
      direction: 'ascending',
    });
    expect(sortButton.closest('th')).toHaveAttribute('aria-sort', 'ascending');
    const bodyRows = screen.getAllByRole('row').slice(1);
    expect(within(bodyRows[0]!).getByText('Alfa')).toBeVisible();

    sortButton.focus();
    await user.keyboard('{Enter}');
    expect(sortButton.closest('th')).toHaveAttribute('aria-sort', 'descending');
  });

  it('keeps loading geometry and renders an explicit empty state', () => {
    const { rerender } = render(
      <DataTable
        columns={columns}
        rows={[]}
        getRowId={(row) => row.id}
        caption="Projeler"
        labels={labels}
        emptyState="Henüz proje yok"
        loading
        loadingRows={3}
      />,
    );
    expect(screen.getAllByRole('row', { name: labels.loading })).toHaveLength(
      3,
    );
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <DataTable
        columns={columns}
        rows={[]}
        getRowId={(row) => row.id}
        caption="Projeler"
        labels={labels}
        emptyState="Henüz proje yok"
      />,
    );
    expect(screen.getByText('Henüz proje yok')).toBeVisible();
    expect(screen.getByRole('table')).not.toHaveAttribute('aria-busy');
  });

  it('supports indeterminate and select-all row selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        caption="Projeler"
        labels={labels}
        emptyState="Proje yok"
        selection={{
          onValueChange,
          getRowLabel: (row) => `${row.name} projesini seç`,
          selectAllLabel: 'Tüm projeleri seç',
          clearAllLabel: 'Tüm proje seçimlerini kaldır',
        }}
      />,
    );

    await user.click(
      screen.getByRole('checkbox', { name: 'Alfa projesini seç' }),
    );
    const selectAll = screen.getByRole('checkbox', {
      name: 'Tüm projeleri seç',
    });
    expect(selectAll).toHaveAttribute('aria-checked', 'mixed');
    expect(onValueChange).toHaveBeenLastCalledWith(['2']);

    await user.click(selectAll);
    expect(onValueChange).toHaveBeenLastCalledWith(['1', '2']);
    expect(
      screen.getByRole('checkbox', {
        name: 'Tüm proje seçimlerini kaldır',
      }),
    ).toBeChecked();
  });

  it('keeps unavailable rows disabled during bulk selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        caption="Projeler"
        labels={labels}
        emptyState="Proje yok"
        selection={{
          onValueChange,
          getRowLabel: (row) => `${row.name} projesini seç`,
          selectAllLabel: 'Tüm projeleri seç',
          clearAllLabel: 'Tüm proje seçimlerini kaldır',
          isRowSelectable: (row) => row.name !== 'Zeta',
        }}
      />,
    );

    expect(
      screen.getByRole('checkbox', { name: 'Zeta projesini seç' }),
    ).toBeDisabled();
    await user.click(
      screen.getByRole('checkbox', { name: 'Tüm projeleri seç' }),
    );
    expect(onValueChange).toHaveBeenCalledWith(['2']);
  });

  it('paginates client rows and limits bulk selection to the visible page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        caption="Projeler"
        labels={labels}
        emptyState="Proje yok"
        pagination={{
          pageSize: 1,
          onPageChange,
          labels: paginationLabels,
        }}
        selection={{
          onValueChange,
          getRowLabel: (row) => `${row.name} projesini seç`,
          selectAllLabel: 'Görünür projeleri seç',
          clearAllLabel: 'Görünür seçimleri kaldır',
        }}
      />,
    );

    expect(screen.getByText('Zeta')).toBeVisible();
    expect(screen.queryByText('Alfa')).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('checkbox', { name: 'Görünür projeleri seç' }),
    );
    expect(onValueChange).toHaveBeenCalledWith(['1']);

    await user.click(screen.getByRole('button', { name: 'Sonraki' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByText('Alfa')).toBeVisible();
    expect(screen.getByText('2 / 2. sayfa')).toBeVisible();
  });

  it('renders manually loaded rows against the remote total', () => {
    render(
      <DataTable
        columns={columns}
        rows={[rows[1]!]}
        getRowId={(row) => row.id}
        caption="Projeler"
        labels={labels}
        emptyState="Proje yok"
        pagination={{
          mode: 'manual',
          page: 2,
          pageSize: 1,
          totalRows: 3,
          labels: paginationLabels,
        }}
      />,
    );

    expect(screen.getByText('Alfa')).toBeVisible();
    expect(screen.getByText('2 / 3. sayfa')).toBeVisible();
  });
});
