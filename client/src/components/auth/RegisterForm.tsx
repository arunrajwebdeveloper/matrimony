"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { RegisterPayloads } from "@/types";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import CircleSpinner from "../ui/CircleSpinner";

type PasswordField = "password" | "confirmPassword";

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterPayloads>({
    defaultValues: {
      email: "arunrajcvkl@gmail.com",
      password: "12345678",
      confirmPassword: "12345678",
      firstName: "Arun",
      lastName: "Raj",
      gender: "Male",
      dateOfBirth: "1990-10-10T00:00:00",
      phoneNumber: "9888776765",
    },
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const password = watch("password", "");

  // Is at least 8 characters long.
  // Contains at least one uppercase letter.
  // Contains at least one lowercase letter.
  // Contains at least one digit.
  // Contains at least one of the specified special characters.
  // Eg: Hello@123!
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

  const showHidePassword = (field: PasswordField) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const { register: createUser, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const genderValue = watch("gender");
  const dateOfBirthValue = watch("dateOfBirth");
  const phoneNumberValue = watch("phoneNumber");
  const confirmPasswordValue = watch("confirmPassword");

  useEffect(() => {
    if (
      error &&
      (emailValue ||
        passwordValue ||
        confirmPasswordValue ||
        firstNameValue ||
        lastNameValue ||
        genderValue ||
        dateOfBirthValue ||
        phoneNumberValue)
    ) {
      clearError();
    }
  }, [
    emailValue,
    passwordValue,
    confirmPasswordValue,
    firstNameValue,
    lastNameValue,
    genderValue,
    dateOfBirthValue,
    phoneNumberValue,
  ]);

  const onSubmit = async (payload: any): Promise<void> => {
    const { confirmPassword, ...rest } = payload;
    const result = await createUser(rest);

    if (result.success) {
      router.push(ROUTES.LOGIN);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8 text-left">Register</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className={`w-full p-3 border-1 rounded-md focus:outline-none focus:ring-1 ${
                  errors.firstName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                {...register("firstName", {
                  required: "FirstName is required",
                  minLength: {
                    value: 3,
                    message: "First name must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 20,
                    message: "First name limited to 20 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z]+$/,
                    message: "Only alphabetic characters allowed",
                  },
                })}
                placeholder="First Name"
              />
              {errors.firstName && (
                <p className=" text-sm text-red-500 font-normal m-0 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className={`w-full p-3 border-1 rounded-md focus:outline-none focus:ring-1 ${
                  errors.lastName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                {...register("lastName", {
                  maxLength: {
                    value: 20,
                    message: "First name limited to 20 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z]+$/,
                    message: "Only alphabetic characters allowed",
                  },
                })}
                placeholder="Last Name"
              />
              {errors.lastName && (
                <p className=" text-sm text-red-500 font-normal m-0 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        </div>
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

        <div className="mb-4">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Gender
          </label>
          <select
            className={`w-full p-3 border-1 rounded-md focus:outline-none focus:ring-1 ${
              errors.gender
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            id="gender"
            {...register("gender", {
              required: "Gender is required",
            })}
          >
            <option value="">-- Select --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {errors.gender && (
            <p className=" text-sm text-red-500 font-normal m-0 mt-1">
              {errors.gender.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            {...register("dateOfBirth", {
              required: "Date Of Birth is required",
            })}
            className={`w-full p-3 border-1 rounded-md focus:outline-none focus:ring-1 ${
              errors.dateOfBirth
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            placeholder="Enter your DOB"
          />

          {errors.dateOfBirth && (
            <p className=" text-sm text-red-500 font-normal m-0 mt-1">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            {...register("phoneNumber", {
              required: "Phone Number is required",
              validate: {
                // Custom validation rule for checking if the value is a number
                isNumber: (value) =>
                  /^\d+$/.test(value) || "Only numbers are allowed",
                // Custom validation rule for checking if the length is 10
                hasTenDigits: (value) =>
                  value.length === 10 ||
                  "Phone number must be exactly 10 digits",
              },
            })}
            className={`w-full p-3 border-1 rounded-md focus:outline-none focus:ring-1 ${
              errors.phoneNumber
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            placeholder="Enter your Phone number"
          />
          {errors.phoneNumber && (
            <p className=" text-sm text-red-500 font-normal m-0 mt-1">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
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
          {isLoading ? <CircleSpinner /> : "Sign Up"}
        </button>
      </form>

      <div className="space-y-1 mt-5">
        <p className="text-sm text-slate-700">
          Already have an account?{" "}
          <Link className="text-blue-600" href="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
