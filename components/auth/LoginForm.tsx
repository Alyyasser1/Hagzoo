"use client";
import React, { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginFormValues = z.infer<typeof loginSchema>;
const LoginForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      window.location.replace("/home"); // full reload instead of client-side push
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("An unexpected error occurred");
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-field">
      {serverError && <div className="input-error">{serverError}</div>}
      <Input
        type="email"
        label="Email"
        id="email"
        placeholder="example@gmail.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        type="password"
        label="Password"
        id="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        variant="primary"
        size="full"
        isLoading={isSubmitting}
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
