"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { ResetPasswordCredentials } from "@/types";
import Link from "next/link";
import { useForm } from "react-hook-form";
import CircleSpinner from "../ui/CircleSpinner";
import { Eye, EyeOff } from "lucide-react";

type PasswordField = "password" | "confirmPassword";

const ResetPasswordForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordCredentials>({
    defaultValues: {
      password: "12345678",
      confirmPassword: "12345678",
    },
  });

  const { resetPassword, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const password = watch("password", "");
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

  const showHidePassword = (field: PasswordField) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    if ((error && passwordValue) || confirmPasswordValue) {
      clearError();
    }
  }, [passwordValue, confirmPasswordValue]);

  const onSubmit = async (payload: any): Promise<void> => {
    if (!token) throw Error("Token missing");
    const { confirmPassword, ...rest } = payload;
    const result = await resetPassword({ ...rest, token });

    if (result.success) {
      router.push(ROUTES.LOGIN);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-left">Reset Password</h2>
      <p className="text-sm font-normal text-slate-500 mb-8">
        Create a new password for your account
      </p>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword.password ? "text" : "password"}
              id="password"
              className={`w-full p-3 pr-12 border-1 rounded-md focus:outline-none focus:ring-1 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                maxLength: {
                  value: 50,
                  message: "Password limited to 50 characters",
                },
                // pattern: {
                //   value: passwordPattern,
                //   message:
                //     "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@ $ ! % * ? &)",
                // },
              })}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => showHidePassword("password")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword.password ? (
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

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              className={`w-full p-3 pr-12 border-1 rounded-md focus:outline-none focus:ring-1 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "The passwords do not match",
              })}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => showHidePassword("confirmPassword")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword.confirmPassword ? (
                <EyeOff size={20} color="gray" />
              ) : (
                <Eye size={20} color="gray" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className=" text-sm text-red-500 font-normal m-0 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer bg-emerald-500 text-white py-3 px-4 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <CircleSpinner /> : "Reset Password"}
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

export default ResetPasswordForm;
