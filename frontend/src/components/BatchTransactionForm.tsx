import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useTransaction } from '../hooks/useTransaction';
import {type TransactionInput } from '../types/transaction.types';
import { batchTransactionSchema } from '../schemas/transaction.schema';

import { InputField } from './InputField';

const BatchTransactionForm: React.FC = () => {
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
          transaction => ({ ...transaction, amount: Number(transaction.amount) })
        );
        await createBatchTransactions(formattedTransactions);
        resetForm({ values: initialValues });
        setSubmitting(false);
      }}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <FieldArray name="transactions">
            {({ remove, push }) => (
              <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                {values.transactions.map((_transaction, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr auto auto',
                    gap: '10px',
                    marginBottom: '10px',
                    alignItems: 'start'
                  }}>
                    <InputField
                      label={`Título ${index + 1}`}
                      name={`transactions.${index}.title`}
                      type="text"
                    />                    
                    <InputField
                      label="Valor"
                      name={`transactions.${index}.amount`}
                      type="number"
                    />
                    <div className="mb-4">
                      <label htmlFor={`transactions.${index}.type`} className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                      <Field
                        as="select"
                        id={`transactions.${index}.type`}
                        name={`transactions.${index}.type`}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="despesa">Despesa</option>
                        <option value="ganho">Ganho</option>
                      </Field>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      style={{ height: '42px', marginTop: '22px', border: 'none', background: 'transparent', color: 'red', cursor: 'pointer' }}
                      title="Remover Linha"
                    >
                      &#x2716;
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => push({ title: '', amount: '', type: 'despesa' })}
                  className="text-blue-500 mt-2"
                >
                  + Adicionar Outra Transação
                </button>
              </div>
            )}
          </FieldArray>

       <ErrorMessage name="transactions">
            {msg => {
              if (typeof msg === 'string') {
                return <div className="text-red-500 text-sm mt-1">{msg}</div>;
              }
              return <div className="text-red-500 text-sm mt-1">Por favor, corrija os erros nos campos acima.</div>;
            }}
          </ErrorMessage>
          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 mt-4">
            {isSubmitting ? 'Salvando...' : 'Salvar Transações em Lote'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default BatchTransactionForm;