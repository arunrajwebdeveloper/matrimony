"use client";

import {
  FormCheckbox,
  FormInput,
  FormToggleSwitch,
} from "@/components/ui/form-fields";
import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

// --- DTO for Security Settings ---
interface UpdateSecurityDto {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  twoFactorAuthEnabled?: boolean;
}

// --- Sample Data for the form to pre-populate ---
const sampleSecurityData: UpdateSecurityDto = {
  twoFactorAuthEnabled: true,
};

const SecuritySettings: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UpdateSecurityDto>({
    defaultValues: sampleSecurityData,
  });

  const onSubmit: SubmitHandler<UpdateSecurityDto> = async (data) => {
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Basic validation for password change
      if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
        setErrorMessage("New password and confirmation do not match.");
        setIsSubmitting(false);
        return;
      }

      // Simulate an API call for security settings update
      console.log("Submitting security data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      setSuccessMessage("Security settings updated successfully!");
      reset(sampleSecurityData); // Reset the form after successful submission
    } catch (error) {
      setErrorMessage("Failed to update security settings. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ps-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">
        Security Settings
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="mb-6">
          <h2 className="font-semibold text-black text-md mb-4">
            Password Management
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <FormInput
              label="Current Password"
              name="currentPassword"
              placeholder="********"
              type="password"
              register={register}
              errors={errors}
            />
            <FormInput
              label="New Password"
              name="newPassword"
              placeholder="********"
              type="password"
              register={register}
              errors={errors}
            />
            <FormInput
              label="Confirm New Password"
              name="confirmNewPassword"
              placeholder="********"
              type="password"
              register={register}
              errors={errors}
            />
          </div>
        </section>

        <section className="mb-6 flex justify-between items-center">
          <h2 className="font-semibold text-black text-md mb-4">
            Two-Factor Authentication (2FA)
          </h2>
          {/* <FormCheckbox
            label="Enable Two-Factor Authentication"
            name="twoFactorAuthEnabled"
            control={control}
          /> */}

          <FormToggleSwitch name="twoFactorAuthEnabled" control={control} />
        </section>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Settings"}
          </button>

          {successMessage && (
            <p className="mt-4 text-center text-sm font-medium text-green-600">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="mt-4 text-center text-sm font-medium text-red-600">
              {errorMessage}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;
