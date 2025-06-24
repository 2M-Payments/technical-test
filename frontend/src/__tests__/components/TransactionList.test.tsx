import { render, screen, fireEvent } from '@testing-library/react';
import TransactionList from '../../components/TransactionList';
import { type Transaction } from '../../types/transactionTypes';

describe('TransactionList', () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      title: 'Salário',
      amount: 5000,
      type: 'ganho',
      createdAt: new Date().toISOString(),
    },
  ];

  it('calls onEdit and onDelete correctly', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onSelect = jest.fn();

    render(
      <TransactionList
        transactions={transactions}
        onEdit={onEdit}
        onDelete={onDelete}
        selectedIds={[]}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByTitle('Editar'));
    expect(onEdit).toHaveBeenCalledWith(transactions[0]);

    fireEvent.click(screen.getByTitle('Apagar'));
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});