import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BatchTransactionForm from '../../components/BatchTransactionForm';
import { useTransaction } from '../../hooks/useTransaction';

jest.mock('../../hooks/useTransaction');

describe('BatchTransactionForm', () => {
  const mockOnClose = jest.fn();
  const mockCreateBatchTransactions = jest.fn().mockResolvedValue({});

  beforeEach(() => {
    mockCreateBatchTransactions.mockClear();
    mockOnClose.mockClear();
    
    (useTransaction as jest.Mock).mockReturnValue({ 
      createBatchTransactions: mockCreateBatchTransactions 
    });
  });

  it('submits multiple transactions', async () => {
    render(<BatchTransactionForm onClose={mockOnClose} />);

    const titleInputs = screen.getAllByLabelText(/Título/i);
    const amountInputs = screen.getAllByLabelText(/Valor/i); 

    fireEvent.change(titleInputs[0], { target: { value: 'Conta de Luz' } });
    fireEvent.change(amountInputs[0], { target: { value: '150' } });

    await fireEvent.click(screen.getByRole('button', { name: /Salvar em Lote/i }));
    
    await waitFor(() => {
      expect(mockCreateBatchTransactions).toHaveBeenCalledWith([
        { title: 'Conta de Luz', amount: 150, type: 'despesa' }, 
      ]);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});