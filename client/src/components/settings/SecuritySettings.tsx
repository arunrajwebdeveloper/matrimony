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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Security Settings
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Password Management
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="mb-4">
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  {...register("currentPassword")}
                  placeholder="********"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  {...register("newPassword")}
                  placeholder="********"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  {...register("confirmNewPassword")}
                  placeholder="********"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.confirmNewPassword?.message && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.confirmNewPassword?.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Two-Factor Authentication (2FA)
            </h2>
            <div className="flex items-center">
              <Controller
                name="twoFactorAuthEnabled"
                control={control}
                render={({ field }) => (
                  <input
                    id="twoFactorAuthEnabled"
                    type="checkbox"
                    // Corrected: Use 'checked' and 'onChange' specifically
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                )}
              />
              <label
                htmlFor="twoFactorAuthEnabled"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                Enable Two-Factor Authentication
              </label>
            </div>
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
    </div>
  );
};

export default SecuritySettings;
