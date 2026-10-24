import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../../components/Button/Button';
import { SuccessPage } from './SuccessPage';

describe('SuccessPage', () => {
  it('labels the region from its title and keeps details and actions visible', () => {
    render(
      <SuccessPage
        title="Çalışma alanı hazır"
        description="Takımınız kullanmaya başlayabilir."
        details={<span>Kimlik: KW-1042</span>}
        primaryAction={<Button>Çalışma alanını aç</Button>}
        secondaryAction={<Button variant="ghost">Ana sayfaya dön</Button>}
      />,
    );
    const region = screen.getByRole('region', { name: 'Çalışma alanı hazır' });
    expect(region).toHaveTextContent('Kimlik: KW-1042');
    expect(
      screen.getByRole('button', { name: 'Çalışma alanını aç' }),
    ).toBeInTheDocument();
  });
});
