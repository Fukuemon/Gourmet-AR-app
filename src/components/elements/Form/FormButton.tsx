import React from "react";

interface FormButtonProps {
  type: "submit" | "reset" | "button";
  disabled: boolean;
  children: React.ReactNode;
}

const FormButton: React.FC<FormButtonProps> = ({
  type,
  disabled,
  children,
}) => (
  <button
    type={type}
    className="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    disabled={disabled}
  >
    {children}
  </button>
);

export default FormButton;
