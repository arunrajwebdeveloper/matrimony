"use client";

import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { LoginCredentials } from "@/types";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import CircleSpinner from "../ui/CircleSpinner";

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: "arunrajcvkl@gmail.com",
      password: "12345678",
    },
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { login, isLoading, error, clearError } = useAuth();

  const emailValue = watch("email");
  const passwordValue = watch("password");

  useEffect(() => {
    if (error && (emailValue || passwordValue)) {
      clearError();
    }
  }, [emailValue, passwordValue]);

  const onSubmit = async (payload: any): Promise<void> => {
    const result = await login(payload);

    if (result.success) {
      router.push(ROUTES.DASHBOARD);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8 text-left">Login</h2>
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
            <span className="text-red-500 text-sm ms-1">*</span>
          </label>
          <input
            type="email"
            id="email"
            className={`w-full p-3 border-1 rounded-md focus:outline-none focus:ring-1 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            placeholder="Enter your email"
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className=" text-sm text-red-500 font-normal m-0 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
            <span className="text-red-500 text-sm ms-1">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className={`w-full p-3 pr-12 border-1 rounded-md focus:outline-none focus:ring-1 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff size={20} color="gray" />
              ) : (
                <Eye size={20} color="gray" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className=" text-sm text-red-500 font-normal m-0 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <CircleSpinner /> : "Log In"}
        </button>
      </form>
      <div className="space-y-1 mt-5">
        <p className="text-sm text-slate-700">
          Don’t have an account?{" "}
          <Link className="text-blue-600" href="/register">
            Create an Account
          </Link>
        </p>
        <p className="text-sm text-slate-700">
          Forgot password?{" "}
          <Link className="text-blue-600" href="/forgot-password">
            Reset password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
