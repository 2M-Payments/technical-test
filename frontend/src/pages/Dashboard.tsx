import { useEffect, useState, type FC } from 'react';
import { useTransaction } from '../hooks/useTransaction';
import { type Transaction } from '../types/transactionTypes';

import TransactionForm from '../components/TransactionForm';
import EditTransactionModal from '../components/EditTransactionModal';
import BatchTransactionForm from '../components/BatchTransactionForm';
import Summary from '../components/Summary';
import TransactionList from '../components/TransactionList';

import { FiPlus, FiTrash2, FiSearch, FiUpload,FiLogOut } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const DashboardPage: FC = () => {
  const {
    transactions,
    loading,
    fetchData,
    removeTransaction,
    deleteBatchTransactions,
    deleteAllTransactions
  } = useTransaction();

  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Deseja apagar ${selectedIds.length} transações?`)) {
      deleteBatchTransactions(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm("Deseja realmente apagar TODAS as transações?")) {
      deleteAllTransactions();
    }
  };

  const filteredTransactions = transactions.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <TransactionForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {showBatchForm && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <BatchTransactionForm onClose={() => setShowBatchForm(false)} />
          </div>
        </div>
      )}

      <header className="bg-[#00A7E7] text-white py-6 p-4 max-w-5xl mx-auto rounded-b-2xl shadow flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-center w-full">Controle Financeiro</h1>
        <button
            onClick={() => {
              signOut();
              navigate('/login');
            }}
            className="absolute right-6 top-6 flex items-center gap-2 cursor-pointer text-[#00A7E7] hover:text-red-200"
            title="Sair"
          >
          <FiLogOut className="text-xl" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </header>

      <main className="p-4 max-w-5xl mx-auto">
        <Summary />
        <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center flex-grow min-w-0 border rounded px-3 py-2">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Buscar transação..."
              className="outline-none w-full ml-2"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowForm(true)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg">
              <FiPlus className="cursor-pointer" />
            </button>
            <button onClick={() => setShowBatchForm(true)} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg">
              <FiUpload className="cursor-pointer" />
            </button>
            {selectedIds.length > 0 && (
              <button onClick={handleDeleteSelected} className="bg-yellow-500 hover:bg-yellow-600 text-black p-2 rounded-lg">
                <FiTrash2 className="cursor-pointer" />
              </button>
            )}
            {transactions.length > 0 && (
              <button onClick={handleDeleteAll} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg">
                <FiTrash2 className="cursor-pointer" />
              </button>
            )}
          </div>
        </div>

        <section className="mt-6 space-y-3">
          {loading && transactions.length === 0 ? (
            <p>Carregando...</p>
          ) : (
            <TransactionList
              transactions={filteredTransactions}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onEdit={setEditingTransaction}
              onDelete={removeTransaction}
            />
          )}
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
