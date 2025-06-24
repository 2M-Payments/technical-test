import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TransactionForm from '../../components/TransactionForm';
import { useTransaction } from '../../hooks/useTransaction';

jest.mock('../../hooks/useTransaction');

describe('TransactionForm', () => {
  const mockAddTransaction = jest.fn().mockResolvedValue({});
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockAddTransaction.mockClear();
    mockOnClose.mockClear();
    (useTransaction as jest.Mock).mockReturnValue({
      addTransaction: mockAddTransaction,
    });
  });

  it('submits a new transaction', async () => {
    render(<TransactionForm onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Salário' } });
    fireEvent.change(screen.getByLabelText(/Valor/i), { target: { value: '5000' } });
    fireEvent.change(screen.getByLabelText(/Tipo/i), { target: { value: 'ganho' } });

    await fireEvent.click(screen.getByRole('button', { name: /Adicionar/i }));

    await waitFor(() => {
      expect(mockAddTransaction).toHaveBeenCalledWith({
        title: 'Salário',
        amount: 5000,
        type: 'ganho',
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});