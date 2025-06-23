import { Formik, Form } from 'formik';
import { InputField } from './InputField';
interface FieldConfig {
  name: string;
  label: string;
  type?: string;
}

interface AuthFormProps {
  initialValues: Record<string, string>;
  onSubmit: (values: any) => void;
  validationSchema: any;
  fields: FieldConfig[];
  submitText: string;
}

export const AuthForm = ({
  initialValues,
  onSubmit,
  validationSchema,
  fields,
  submitText,
}:AuthFormProps) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    <Form className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      {fields.map(field => (
        <InputField key={field.name} {...field} />
      ))}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-4 transition duration-200"
      >
        {submitText}
      </button>
    </Form>
  </Formik>
);
