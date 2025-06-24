import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useTransaction } from '../hooks/useTransaction';
import { type TransactionInput } from '../types/transactionTypes';
import { batchTransactionSchema } from '../schemas/transactionSchema';

import { InputField } from './InputField';

interface BatchTransactionFormProps {
  onClose: () => void;
}

const BatchTransactionForm = ({ onClose }: BatchTransactionFormProps) => {
  const { createBatchTransactions } = useTransaction();

  const initialValues = {
    transactions: [{ title: '', amount: '', type: 'despesa' as const }],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(batchTransactionSchema)}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        const formattedTransactions: TransactionInput[] = values.transactions.map(
          (t) => ({ ...t, amount: Number(t.amount) })
        );
        await createBatchTransactions(formattedTransactions);
        resetForm({ values: initialValues });
        setSubmitting(false);
        onClose();
      }}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <FieldArray name="transactions">
            {({ remove, push }) => (
              <div className="max-h-[300px] overflow-y-auto pr-[10px]">
                {values.transactions.map((_transaction, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_auto_auto] gap-[10px] mb-[10px] items-start">
                    <InputField label={`Título ${index + 1}`} name={`transactions.${index}.title`} type="text" />
                    <InputField label="Valor" name={`transactions.${index}.amount`} type="number" />
                    <div className="mb-4">
                      <label htmlFor={`transactions.${index}.type`} className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                      <Field as="select" id={`transactions.${index}.type`} name={`transactions.${index}.type`} className="w-full px-4 py-2 border rounded-lg">
                        <option value="despesa">Despesa</option>
                        <option value="ganho">Ganho</option>
                      </Field>
                    </div>
                    <button type="button" onClick={() => remove(index)} className="h-[42px] mt-[22px] text-red-500 cursor-pointer">
                      &#x2716;
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => push({ title: '', amount: '', type: 'despesa' })} className="text-blue-500 mt-2 cursor-pointer">
                  + Adicionar Outra Transação
                </button>
              </div>
            )}
          </FieldArray>

          <ErrorMessage name="transactions">
            {(msg) => (
              <div className="text-red-500 text-sm mt-1">
                {typeof msg === 'string' ? msg : 'Por favor, corrija os erros nos campos acima.'}
              </div>
            )}
          </ErrorMessage>

          <div className="flex justify-end gap-3 pt-6">
            <button type="button" onClick={onClose} className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-lg">
              Fechar
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:bg-blue-300">
              {isSubmitting ? 'Salvando...' : 'Salvar em Lote'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BatchTransactionForm;
