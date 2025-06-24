import { Formik, Form, Field } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useTransaction } from '../hooks/useTransaction';
import { transactionSchema } from '../schemas/transactionSchema';
import { type Transaction } from '../types/transactionTypes';
import { InputField } from './InputField';

interface EditModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const EditTransactionModal = ({ transaction, onClose }: EditModalProps) => {
  const { editTransaction } = useTransaction();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Editar Transação</h2>
        <Formik
          initialValues={{
            title: transaction.title,
            amount: transaction.amount.toString(),
            type: transaction.type,
          }}
          validationSchema={toFormikValidationSchema(transactionSchema)}
          onSubmit={async (values) => {
            await editTransaction(transaction.id, {
              title: values.title,
              type: values.type as 'ganho' | 'despesa',
              amount: Number(values.amount),
            });
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <InputField name="title" label="Título" />
              <InputField name="amount" label="Valor (R$)" type="number" />
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <Field as="select" name="type" className="w-full px-4 py-2 border rounded-lg">
                  <option value="ganho">Ganho</option>
                  <option value="despesa">Despesa</option>
                </Field>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                  Fechar
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:bg-blue-300">
                  {isSubmitting ? 'Salvando...' : 'Editar'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditTransactionModal;
