import { Field, ErrorMessage } from 'formik';

interface Props {
  name: string;
  label: string;
  type?: string;
}

export const InputField: React.FC<Props> = ({ name, label, type = 'text' }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <Field
      id={name}
      name={name}
      type={type}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <ErrorMessage name={name}>
      {msg => <div className="text-red-500 text-sm mt-1">{msg}</div>}
    </ErrorMessage>
  </div>
);
