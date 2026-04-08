import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const SignupForm = () => {
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for Phase 5 auth logic goes here
  };
  return (
    <form onSubmit={handleSignup} className="flex-col gap-4">
      <Input
        type="text"
        label="Username"
        id="username"
        placeholder="Choose a username"
      ></Input>
      <Input
        type="email"
        label="Email"
        id="email"
        placeholder="Enter your Email"
      ></Input>
      <Input
        type="tel"
        label="Phone"
        id="phone"
        placeholder="+20 1XX XXX XXXX"
      ></Input>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Birth date"
          type="date"
          id="birthdate"
          placeholder="DD/MM/YYYY"
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Level</label>
          <select className="bg-[#1a1a1a] border border-[#282828] rounded-lg p-2 text-white">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>
      <Input
        type="password"
        label="Password"
        id="password"
        placeholder="Create password"
      ></Input>
      <Input
        type="password"
        label="Confirm password"
        id="password"
        placeholder="Re-enter your password"
      ></Input>
      <Button type="submit" variant="primary" size="full">
        Create acconut
      </Button>
    </form>
  );
};

export default SignupForm;
