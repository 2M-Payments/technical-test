import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditTransactionModal from '../../components/EditTransactionModal';
import { useTransaction } from '../../hooks/useTransaction';
import { type Transaction } from '../../types/transactionTypes';

jest.mock('../../hooks/useTransaction');

describe('EditTransactionModal', () => {
  const mockEditTransaction = jest.fn().mockResolvedValue({});
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockEditTransaction.mockClear();
    mockOnClose.mockClear();
    (useTransaction as jest.Mock).mockReturnValue({ 
      editTransaction: mockEditTransaction 
    });
  });

  it('submits transaction edit', async () => {
    const transaction: Transaction = {
      id: '1',
      title: 'Luz',
      amount: 100,
      type: 'despesa',
      createdAt: new Date().toISOString(),
    };

    render(<EditTransactionModal transaction={transaction} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/Título/), { target: { value: 'Água' } });

    await fireEvent.click(screen.getByRole('button', { name: /Editar/i }));

    await waitFor(() => {
      expect(mockEditTransaction).toHaveBeenCalledWith('1', {
        title: 'Água',
        amount: 100,
        type: 'despesa',
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});