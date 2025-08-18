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
  label?: string;
  name: string;
  control: Control<any>;
  disabled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
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

export const FormToggleSwitch: React.FC<FormCheckboxProps> = ({
  name,
  control,
  disabled = false,
  size = "md",
  ...rest
}) => {
  const sizeClasses = {
    sm: {
      label: "w-8 h-5 rounded-full",
      thumb: "after:w-[14px] after:h-[14px] after:rounded-full",
      position: "after:top-[3px] after:left-[3px]",
      activeWidth: "active:after:w-[18px] peer-disabled:after:!w-[14px]",
      checkedPosition:
        "peer-checked:after:left-[calc(100%-3px)] peer-checked:after:translate-x-[-100%]",
    },
    md: {
      label: "w-10 h-6 rounded-full",
      thumb: "after:w-4.5 after:h-4.5 after:rounded-full",
      position: "after:top-[3px] after:left-[3px]",
      activeWidth: "active:after:w-[22px] peer-disabled:after:!w-4.5",
      checkedPosition:
        "peer-checked:after:left-[calc(100%-3px)] peer-checked:after:translate-x-[-100%]",
    },

    lg: {
      label: "w-14 h-8 rounded-full",
      thumb: "after:w-6 after:h-6 after:rounded-full",
      position: "after:top-[4px] after:left-[4px]",
      activeWidth: "active:after:w-[30px] peer-disabled:after:!w-6",
      checkedPosition:
        "peer-checked:after:left-[calc(100%-4px)] peer-checked:after:translate-x-[-100%]",
    },
    xl: {
      label: "w-16 h-9 rounded-full",
      thumb: "after:w-7 after:h-7 after:rounded-full",
      position: "after:top-[4px] after:left-[4px]",
      activeWidth: "active:after:w-[34px] peer-disabled:after:!w-7",
      checkedPosition:
        "peer-checked:after:left-[calc(100%-4px)] peer-checked:after:translate-x-[-100%]",
    },
  };

  const currentSizeClasses = sizeClasses[size] || sizeClasses.md;

  const labelClasses = `
    relative text-[0px] bg-slate-500 block transition cursor-pointer peer-disabled:opacity-50
    peer-disabled:cursor-default peer-checked:bg-green-500 indent-[-9999px]
    after:content-[''] after:absolute after:bg-white after:shadow-md
    after:transition-all after:duration-300
    ${currentSizeClasses.label}
    ${currentSizeClasses.thumb}
    ${currentSizeClasses.position}
    ${currentSizeClasses.activeWidth}
    ${currentSizeClasses.checkedPosition}
  `;

  return (
    <div className="flex items-center select-none">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            type="checkbox"
            id={name}
            checked={field.value}
            onChange={field.onChange}
            className="w-0 h-0 hidden opacity-0 peer"
            disabled={disabled}
            {...rest}
          />
        )}
      />
      <label className={labelClasses} htmlFor={name}>
        Toggle
      </label>
    </div>
  );
};
