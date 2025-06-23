import { Formik, Form, Field } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useTransaction } from '../hooks/useTransaction';
import { transactionFormSchema } from '../schemas/transaction.schema';
import { InputField } from './InputField';
import type { TransactionInput } from '../types/transaction.types';

const TransactionForm = () => {
  const { addTransaction } = useTransaction();

  const initialValues = {
    title: '',
    amount: '',
    type: 'ganho',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(transactionFormSchema)}
     onSubmit={async (values, { setSubmitting, resetForm }) => {
        const formattedTransaction: TransactionInput = {
          title: values.title,
          type: values.type as 'ganho' | 'despesa',
          amount: Number(values.amount),
        };

        await addTransaction(formattedTransaction);
        resetForm({ values: initialValues });
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <InputField
            name="title"
            label="Título da Transação"
            type="text"
          />
          <InputField
            name="amount"
            label="Valor (R$)"
            type="number"
          />
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <Field
              as="select"
              id="type"
              name="type"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ganho">Ganho</option>
              <option value="despesa">Despesa</option>
            </Field>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Transação'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default TransactionForm;