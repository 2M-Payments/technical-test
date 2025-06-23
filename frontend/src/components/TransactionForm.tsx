import { Formik, Form, Field } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useTransaction } from '../hooks/useTransaction';
import { transactionSchema } from '../schemas/transaction.schema';
import { InputField } from './InputField';
import type { TransactionInput } from '../types/transaction.types';

interface TransactionFormProps {
  onClose: () => void;
}

const TransactionForm = ({ onClose }: TransactionFormProps) => {
  const { addTransaction } = useTransaction();

  const initialValues = {
    title: '',
    amount: 0,
    type: 'ganho',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(transactionSchema)}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        const formattedTransaction: TransactionInput = {
          title: values.title,
          type: values.type as 'ganho' | 'despesa',
          amount: Number(values.amount),
        };

        await addTransaction(formattedTransaction);
        resetForm({ values: initialValues });
        setSubmitting(false);
        onClose();
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <InputField name="title" label="Título da Transação" type="text" />
          <InputField name="amount" label="Valor (R$)" type="number" />
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <Field as="select" id="type" name="type" className="w-full px-4 py-2 border rounded-lg">
              <option value="ganho">Ganho</option>
              <option value="despesa">Despesa</option>
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-lg">
              Fechar
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:bg-blue-300">
              {isSubmitting ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TransactionForm;
