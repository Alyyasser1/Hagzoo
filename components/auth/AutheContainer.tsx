"use client";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Button from "../ui/Button";
const AuthContainer = () => {
  const [currentView, setCurrentView] = useState<"login" | "signup">("login");

  return (
    <div>
      <div className="auth-tabs">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setCurrentView("login")}
          className={`${currentView === "login" ? "active" : ""}`}
        >
          Login
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setCurrentView("signup")}
          className={`${currentView === "signup" ? "active" : ""}`}
        >
          Sign up
        </Button>
      </div>
      <div>{currentView === "login" ? <LoginForm /> : <SignupForm />}</div>
    </div>
  );
};

export default AuthContainer;
