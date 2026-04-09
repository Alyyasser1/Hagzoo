import React from "react";
import "./AuthContainer.css";
const AuthCard = ({ children }: { children: React.ReactNode }) => {
  return <div className="auth-card">{children}</div>;
};

export default AuthCard;
