import React from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
const LoginForm = () => {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for Phase 5 auth logic goes here
  };
  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <Input
        type="email"
        label="Email"
        id="email"
        placeholder="Enter your email"
        required
      ></Input>
      <Input
        type="password"
        label="Password"
        id="password"
        placeholder="Enter your password"
        required
      ></Input>
      <Button type="submit" variant="primary" size="full">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
