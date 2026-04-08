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
        label="Username"
        id="username"
        placeholder="Enter your username"
        required
      ></Input>
      <Input
        label="Password"
        id="password"
        placeholder="Enter your password"
        required
      ></Input>
      <Button
        type="submit"
        variant="primary"
        size="full"
        className="mt-2"
      ></Button>
    </form>
  );
};

export default LoginForm;
