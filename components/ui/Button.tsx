import React, { ButtonHTMLAttributes, forwardRef } from "react";
import "./Button.css";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "danger" | "outline" | "ghost" | "accept";
  size: "sm" | "md" | "lg" | "full";
  isLoading?: boolean;
  icon?: React.ReactNode;
}
const variantMap = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  outline: "btn btn-outline",
  danger: "btn btn-danger",
  ghost: "btn btn-ghost",
  accept: "btn btn-accept",
};

const sizeMap = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  full: "btn-full",
};
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, isLoading, icon, children, className, ...props }, ref) => {
    return (
      <button
        className={`${variantMap[variant]} ${sizeMap[size]} ${className ?? ""}`}
        aria-busy={isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          <>
            {icon && <span className="button-icon">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";
export default Button;
