import React from "react";
import "./Input.css";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  id: string;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, errorMessage, id, ...props }, ref) => {
    return (
      <div className="form-field">
        {label && (
          <label htmlFor={id} className="form-label">
            {label}
          </label>
        )}
        <input ref={ref} id={id} {...props} className="form-input" />
        {errorMessage && <span className="input-error">{errorMessage}</span>}
      </div>
    );
  },
);
Input.displayName = "Input";
export default Input;
