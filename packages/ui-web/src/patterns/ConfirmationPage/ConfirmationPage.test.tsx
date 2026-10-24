import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../../components/Button/Button';
import { ConfirmationPage } from './ConfirmationPage';

describe('ConfirmationPage', () => {
  it('presents the decision, persistent details, and product-owned actions', () => {
    render(
      <ConfirmationPage
        title="Çalışma alanını oluştur?"
        description="Ayarları son kez kontrol edin."
        details={
          <dl>
            <dt>Plan</dt>
            <dd>Takım</dd>
          </dl>
        }
        primaryAction={<Button>Onayla ve oluştur</Button>}
        secondaryAction={<Button variant="outline">Düzenlemeye dön</Button>}
      />,
    );
    const region = screen.getByRole('region', {
      name: 'Çalışma alanını oluştur?',
    });
    expect(region).toHaveTextContent('PlanTakım');
    expect(
      screen.getByRole('button', { name: 'Düzenlemeye dön' }),
    ).toBeInTheDocument();
  });
});
