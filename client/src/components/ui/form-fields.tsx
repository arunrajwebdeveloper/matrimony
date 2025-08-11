"use client";

import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  Controller,
} from "react-hook-form";

interface FormInputProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "number" | "textarea" | "password";
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  placeholder,
  type = "text",
  register,
  errors,
}) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 select-none"
    >
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={name}
        {...register(name)}
        placeholder={placeholder}
        className="mt-1 p-4 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        rows={3}
      />
    ) : (
      <input
        id={name}
        type={type}
        {...register(name, { valueAsNumber: type === "number" })}
        placeholder={placeholder}
        className="mt-1 p-4 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    )}
    {errors[name]?.message && (
      <p className="mt-2 text-sm text-red-600">
        {String(errors[name]?.message)}
      </p>
    )}
  </div>
);

interface FormSelectProps {
  label: string;
  name: string;
  options: string[];
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  options,
  register,
  errors,
}) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 select-none"
    >
      {label}
    </label>
    <select
      id={name}
      {...register(name)}
      className="mt-1 p-4 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    >
      <option value="">Select...</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    {errors[name]?.message && (
      <p className="mt-2 text-sm text-red-600">
        {String(errors[name]?.message)}
      </p>
    )}
  </div>
);

interface FormCheckboxProps {
  label: string;
  name: string;
  control: Control<any>;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  name,
  control,
}) => (
  <div className="flex items-center mb-4 select-none">
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          id={name}
          type="checkbox"
          checked={field.value}
          onChange={field.onChange}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      )}
    />
    <label
      htmlFor={name}
      className="ml-2 block text-sm font-medium text-gray-700"
    >
      {label}
    </label>
  </div>
);
