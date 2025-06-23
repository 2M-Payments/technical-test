import React from 'react';
import {type Transaction } from '../types/transaction.types';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  selectedIds: string[];
  onSelect: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  selectedIds,
  onSelect,
}) => {
  if (transactions.length === 0) {
    return <p>Nenhuma transação encontrada.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th><input type="checkbox" disabled /></th>
          <th>Título</th>
          <th>Valor</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id} style={{ backgroundColor: selectedIds.includes(t.id) ? '#e6f7ff' : 'transparent' }}>
            <td>
              <input
                type="checkbox"
                checked={selectedIds.includes(t.id)}
                onChange={() => onSelect(t.id)}
              />
            </td>
            <td>{t.title}</td>
            <td style={{ color: t.type === 'ganho' ? 'green' : 'red' }}>
              {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </td>
            <td>
              <button onClick={() => onEdit(t)}>Editar</button>
              <button onClick={() => onDelete(t.id)}>Apagar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionList;