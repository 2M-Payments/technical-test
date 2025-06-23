import React from 'react';
import { Formik, Form, Field } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useTransaction } from '../hooks/useTransaction';
import { transactionSchema } from '../schemas/transaction.schema';
import {type Transaction } from '../types/transaction.types';
import { InputField } from './InputField';

interface EditModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const EditTransactionModal: React.FC<EditModalProps> = ({ transaction, onClose }) => {
  const { editTransaction } = useTransaction();

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', minWidth: '400px' }}>
        <h2>Editar Transação</h2>
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
            <Form>
              <InputField name="title" label="Título" />
              <InputField name="amount" label="Valor (R$)" type="number" />
              <Field as="select" name="type" className="w-full px-4 py-2 border rounded-lg">
                <option value="ganho">Ganho</option>
                <option value="despesa">Despesa</option>
              </Field>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={onClose}>Cancelar</button>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
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