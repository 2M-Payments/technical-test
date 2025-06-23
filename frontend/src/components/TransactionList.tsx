import { type Transaction } from '../types/transaction.types';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  selectedIds: string[];
  onSelect: (id: string) => void;
}

const TransactionList = ({
  transactions,
  onEdit,
  onDelete,
  selectedIds,
  onSelect,
}: TransactionListProps) => {
  if (transactions.length === 0) {
    return <p className="text-center text-gray-500 mt-4">Nenhuma transação encontrada.</p>;
  }

  return (
    <div className="space-y-3">
      {transactions.map((t) => (
        <div
          key={t.id}
          className={`bg-white flex items-center justify-between p-4 rounded-xl shadow ${
            selectedIds.includes(t.id) ? 'bg-blue-50' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.includes(t.id)}
              onChange={() => onSelect(t.id)}
              className="accent-blue-500"
            />
            <div>
              <p className="font-medium text-gray-800">{t.title}</p>
              <span className="text-sm text-gray-500">
                {new Date(t.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <span>
              {t.type === 'ganho' ? (
                <span className="text-green-600">+</span>
              ) : (
                <span className="text-red-600">-</span>
              )}
            </span>
            <span className="text-lg font-semibold">
              <span className={t.type === 'ganho' ? 'text-green-600' : 'text-red-600'}>
                {t.amount.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </span>

            <button
              onClick={() => onEdit(t)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
              title="Editar"
            >
              <FiEdit className='cursor-pointer' size={18} />
            </button>

            <button
              onClick={() => onDelete(t.id)}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
              title="Apagar"
            >
              <FiTrash2 className='cursor-pointer' size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
