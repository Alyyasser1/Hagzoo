import React, { ButtonHTMLAttributes, forwardRef } from "react";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size: "sm" | "md" | "lg" | "full";
  isLoading?: boolean;
  icon?: React.ReactNode;
}
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, isLoading, icon, children, ...props }, ref) => {
    return (
      <button
        className={`${variant} ${size}`}
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
