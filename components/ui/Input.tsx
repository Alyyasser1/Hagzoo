import React from "react";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  id: string;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, errorMessage, id, ...props }, ref) => {
    return (
      <div>
        {label && <label htmlFor={id}>{label}</label>}
        <input ref={ref} id={id} {...props} />
        {errorMessage && <span>{errorMessage}</span>}
      </div>
    );
  },
);
Input.displayName = "Input";
export default Input;
