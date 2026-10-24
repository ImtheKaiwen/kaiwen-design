import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button/Button';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('describes an empty condition and exposes its next step', () => {
    render(
      <EmptyState
        title="Henüz proje yok"
        description="İlk projenizi oluşturarak başlayın."
        action={<Button>Proje oluştur</Button>}
      />,
    );
    expect(
      screen.getByRole('region', { name: 'Henüz proje yok' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Henüz proje yok' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Proje oluştur' }),
    ).toBeInTheDocument();
  });
});
