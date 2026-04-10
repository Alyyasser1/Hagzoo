"use client";
import Input from "../ui/Input";
import Button from "../ui/Button";
import "../ui/Input.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import z from "zod";
const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    tel: z.string().min(11, "Enter a valid phone number"),
    birthDate: z.string().min(1, "Birth date is required"),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // This tells Zod to put the error on the confirmPassword field
  });

type SignupFormValues = z.infer<typeof signupSchema>;
const SignupForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { level: "Beginner" }, // Match your UI's default
  });

  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Signup failed");

      // Success! Move to home or show a 'Check your email' message
      router.push("/home");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) setServerError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {serverError && <div className="input-error">{serverError}</div>}

      <Input
        label="Username"
        id="username"
        placeholder="e.g. john_doe"
        {...register("username")}
        error={errors.username?.message}
      />

      <Input
        label="Email"
        type="email"
        id="email"
        placeholder="example@gmail.com"
        {...register("email")}
        error={errors.email?.message}
      />

      <Input
        label="Phone"
        type="tel"
        id="phone"
        placeholder="+20 1XX XXX XXXX"
        {...register("tel")}
        error={errors.tel?.message}
      />

      {/* Grid for Birth date and Level */}
      <div className="form-grid">
        <Input
          id="birthDate"
          label="Birth date"
          type="date"
          {...register("birthDate")}
          error={errors.birthDate?.message}
        />

        <div className="form-field">
          <label className="form-label">Level</label>
          <select {...register("level")} className="form-input ">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          {errors.level && (
            <span className="input-error">{errors.level.message}</span>
          )}
        </div>
      </div>

      <Input
        label="Password"
        type="password"
        id="password"
        placeholder="••••••••"
        {...register("password")}
        error={errors.password?.message}
      />

      <Input
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        placeholder="••••••••"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <Button
        type="submit"
        variant="primary"
        size="full"
        isLoading={isSubmitting}
      >
        Create account
      </Button>
    </form>
  );
};

export default SignupForm;
