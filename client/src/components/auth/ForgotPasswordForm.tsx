"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { AuthResult, EmailField } from "@/types";
import Link from "next/link";
import { useForm } from "react-hook-form";
import CircleSpinner from "../ui/CircleSpinner";
import { useToast } from "@/contexts/ToastScope";

const ForgotPasswordForm: React.FC = () => {
  const { showSuccess } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<EmailField>({
    defaultValues: {
      email: "arunrajcvkl@gmail.com",
    },
  });

  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const emailValue = watch("email");

  useEffect(() => {
    if (error && emailValue) {
      clearError();
    }
  }, [emailValue]);

  const onSubmit = async (payload: any): Promise<void> => {
    const result = await forgotPassword(payload);
    if (result.success) {
      showSuccess("Password reset link sent to your registered email.");
      reset();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-left">Forgot Password?</h2>
      <p className="text-sm font-normal text-slate-500 mb-8">
        Enter your email to receive a reset link.
      </p>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            className={`w-full p-3 border-1 rounded-md focus:outline-none focus:ring-1 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className=" text-sm text-red-500 font-normal m-0 mt-1">
              {errors.email.message}
            </p>
          )}
          <div className=" text-sm font-normal text-slate-500 leading-4 mt-2">
            We'll never share your email with anyone else.
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer bg-emerald-500 text-white py-3 px-4 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <CircleSpinner /> : "Send Reset Link"}
        </button>
      </form>

      <div className="space-y-1 mt-5">
        <p className="text-sm text-slate-700">
          Remembered your password?{" "}
          <Link className="text-blue-600" href="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
