import { useTransaction } from '../hooks/useTransaction';

const Summary = () => {
  const { summary } = useTransaction();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <h3 className="text-gray-500 text-sm font-medium">Entradas</h3>
        <p className="text-2xl font-semibold text-green-600 mt-2">
          R$ {summary.income.toFixed(2)}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 text-center">
        <h3 className="text-gray-500 text-sm font-medium">Saídas</h3>
        <p className="text-2xl font-semibold text-red-600 mt-2">
          R$ {summary.expense.toFixed(2)}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 text-center">
        <h3 className="text-gray-500 text-sm font-medium">Saldo Total</h3>
        <p
          className={`text-2xl font-semibold mt-2 ${
            summary.total >= 0 ? 'text-blue-600' : 'text-red-600'
          }`}
        >
          R$ {summary.total.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default Summary;
