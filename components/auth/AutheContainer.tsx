"use client";
import { useSearchParams, useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Button from "../ui/Button";

const AuthContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentView =
    searchParams.get("auth") === "signup" ? "signup" : "login";

  return (
    <div>
      <div className="auth-tabs">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => router.push("?auth=login")}
          className={`${currentView === "login" ? "active" : ""}`}
        >
          Login
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => router.push("?auth=signup")}
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
