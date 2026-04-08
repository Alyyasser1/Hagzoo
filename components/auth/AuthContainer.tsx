"use client";
import { useSearchParams, useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

import React from "react";
import Button from "../ui/Button";

const AuthContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentView =
    searchParams.get("auth") === "signup" ? "signup" : "login";

  return (
    <div>
      <Button
        variant="ghost"
        size="lg"
        onClick={() => router.push("?auth=login")}
        className={`flex-1 rounded-none pb-3 transition-colors duration-300 ${
          currentView === "login"
            ? "text-orange-500 border-b-2 border-orange-500"
            : "text-gray-500 hover:text-gray-300"
        }`}
      >
        Login
      </Button>
      <Button
        variant="ghost"
        size="lg"
        onClick={() => router.push("?auth=signup")}
        className={`flex-1 rounded-none pb-3 transition-colors duration-300 ${
          currentView === "signup"
            ? "text-orange-500 border-b-2 border-orange-500"
            : "text-gray-500 hover:text-gray-300"
        }`}
      >
        Login
      </Button>
      <div>{currentView === "login" ? <LoginForm /> : <SignupForm />}</div>
    </div>
  );
};

export default AuthContainer;
