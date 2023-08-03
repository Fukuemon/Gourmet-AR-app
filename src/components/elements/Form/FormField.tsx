import React, { ChangeEvent, FocusEvent } from "react";

interface FormFieldProps {
  name: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  values: { [key: string]: string };
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  type,
  autoComplete,
  placeholder,
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
}) => (
  <div className="h-20 relative">
    <input
      name={name}
      type={type}
      autoComplete={autoComplete}
      required
      className="w-64 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      placeholder={placeholder}
      value={values[name]}
      onChange={handleChange}
      onBlur={handleBlur}
    />
    {errors[name] && touched[name] && (
      <div className="my-2 text-center text-red-500">{errors[name]}</div>
    )}
    {}
  </div>
);

export default FormField;
