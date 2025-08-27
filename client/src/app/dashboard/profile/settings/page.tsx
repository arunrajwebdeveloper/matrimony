"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import api from "@/lib/api";
import { UserProfile } from "@/types";
import { API_ENDPOINTS, ROUTES } from "@/utils/constants";
import Navigation from "@/components/navigation/Navigation";
import UserSummaryDisplay from "@/components/profile/UserSummaryDisplay";
import Breadcrumb from "@/components/ui/Breadcrumb";
import UploadSinglePage from "@/components/media/UploadSingle";
import UploadMultiplePage from "@/components/media/UploadMultiple";

// --- DTO Interfaces (Copied from user's DTOs for a self-contained component) ---
interface PartnerPreferencesDto {
  minAge?: number;
  maxAge?: number;
  religion?: string[];
  community?: string[];
  motherTongue?: string[];
  country?: string[];
  educationLevel?: string[];
  occupation?: string[];
  annualIncome?: { min?: number; max?: number };
  diet?: string[];
  smokingHabit?: string[];
  drinkingHabit?: string[];
  maritalStatus?: string[];
  bodyType?: string[];
  complexion?: string[];
  disabilityStatus?: string[];
  familyType?: string[];
  familyStatus?: string[];
  familyValues?: string[];
}

interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  aboutMe?: string;
  religion?: string;
  community?: string;
  height?: number;
  weight?: number;
  complexion?: string;
  bodyType?: string;
  disabilityStatus?: string;
  motherTongue?: string;
  maritalStatus?: string;
  children?: number;
  educationLevel?: string;
  educationField?: string;
  occupation?: string;
  annualIncome?: number;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  residencyStatus?: string;
  familyType?: string;
  familyStatus?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  brothers?: number;
  sisters?: number;
  brothersMarried?: number;
  sistersMarried?: number;
  familyValues?: string;
  diet?: string;
  smokingHabit?: string;
  drinkingHabit?: string;
  hobbies?: string[];
  interests?: string[];
  partnerPreferences?: PartnerPreferencesDto;
  profilePhotos?: string[];
  profilePicture?: string;
  visibility?: string;
  star?: string;
  rasi?: string;
  nakshatra?: string;
  birthTime?: string;
  birthPlace?: string;
  horoscopeDocument?: string;
}

// --- Sample Data for the form to pre-populate ---
const sampleProfileData: UpdateProfileDto = {
  firstName: "Jane",
  lastName: "Doe",
  aboutMe: "I am a software engineer who loves traveling and reading.",
  religion: "Hindu",
  maritalStatus: "Never Married",
  height: 165,
  weight: 60,
  children: 0,
  educationLevel: "Bachelors",
  educationField: "Computer Science",
  occupation: "Software Engineer",
  annualIncome: 1200000,
  country: "India",
  state: "Kerala",
  city: "Kochi",
  zipCode: "682001",
  residencyStatus: "Citizen",
  familyType: "Nuclear",
  familyStatus: "Middle Class",
  fatherOccupation: "Engineer",
  motherOccupation: "Homemaker",
  brothers: 1,
  sisters: 0,
  brothersMarried: 1,
  sistersMarried: 0,
  familyValues: "Moderate",
  diet: "Vegetarian",
  smokingHabit: "No",
  drinkingHabit: "No",
  hobbies: ["traveling", "reading", "hiking"],
  interests: ["movies", "music"],
  profilePhotos: ["url_to_photo1.jpg"],
  profilePicture: "url_to_main_profile_picture.jpg",
  visibility: "public",
  star: "Karthika",
  rasi: "Vrishabha",
  nakshatra: "Bharani",
  birthTime: "10:30 AM",
  birthPlace: "Kochi, Kerala, India",
  horoscopeDocument: "url_to_horoscope.pdf",
  partnerPreferences: {
    minAge: 25,
    maxAge: 30,
    religion: ["Hindu", "Christian"],
    community: ["Reddy", "Nair"],
    motherTongue: ["English", "Malayalam"],
    country: ["India", "USA"],
    educationLevel: ["Bachelors", "Masters"],
    occupation: ["Software Engineer", "Doctor"],
    annualIncome: { min: 500000, max: 1000000 },
    diet: ["Vegetarian"],
    smokingHabit: ["No"],
    drinkingHabit: ["No"],
    maritalStatus: ["Never Married"],
    bodyType: ["Average"],
    complexion: ["Fair"],
    disabilityStatus: ["No Disability"],
    familyType: ["Nuclear"],
    familyStatus: ["Middle Class"],
    familyValues: ["Moderate"],
  },
};

const settingsMenu = [
  { tab: ROUTES.PROFILE_SETTINGS.IMAGE_UPLOADS, label: "Images Upload" },
  {
    tab: ROUTES.PROFILE_SETTINGS.PERSONAL_DETAILS,
    label: "Personal Details",
  },
  {
    tab: ROUTES.PROFILE_SETTINGS.EDUCATION_CAREER,
    label: "Education & Career",
  },
  {
    tab: ROUTES.PROFILE_SETTINGS.LOCATION_RESIDENCY,
    label: "Location & Residency",
  },
  {
    tab: ROUTES.PROFILE_SETTINGS.FAMILY_DETAILS,
    label: "Family Details",
  },
  { tab: ROUTES.PROFILE_SETTINGS.LIFESTYLE, label: "Lifestyle" },
  {
    tab: ROUTES.PROFILE_SETTINGS.HOROSCOPE_DETAILS,
    label: "Horoscope Details",
  },
  {
    tab: ROUTES.PROFILE_SETTINGS.PARTNER_PREFERENCES,
    label: "Partner Preferences",
  },
  {
    tab: ROUTES.PROFILE_SETTINGS.PROFILE_PRIVACY,
    label: "Profile Privacy",
  },
];

const Page: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>(settingsMenu[0]?.tab);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleSwitcgTab = (name: string): void => {
    setActiveTab(name);
  };

  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      try {
        const response = await api.get<UserProfile>(API_ENDPOINTS.PROFILE);
        setProfileData(response.data);
      } catch (err: any) {
        setError("Failed to load profile data");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateProfileDto>({
    defaultValues: sampleProfileData,
  });

  const onSubmit: SubmitHandler<UpdateProfileDto> = async (data) => {
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Simulate an API call
      console.log("Submitting data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTextField = (
    label: string,
    fieldName:
      | keyof UpdateProfileDto
      | `partnerPreferences.${keyof PartnerPreferencesDto}`,
    placeholder: string,
    type: "text" | "number" | "textarea" = "text"
  ) => (
    <div className="mb-4">
      <label
        htmlFor={fieldName}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={fieldName}
          {...register(fieldName as any)}
          placeholder={placeholder}
          className="mt-1 p-4 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
        />
      ) : (
        <input
          id={fieldName}
          type={type}
          {...register(fieldName as any, { valueAsNumber: type === "number" })}
          placeholder={placeholder}
          className="mt-1 p-4 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      )}
      {errors[fieldName as keyof UpdateProfileDto]?.message && (
        <p className="mt-2 text-sm text-red-600">
          {errors[fieldName as keyof UpdateProfileDto]?.message}
        </p>
      )}
    </div>
  );

  const renderSelectField = (
    label: string,
    fieldName: keyof UpdateProfileDto,
    options: string[]
  ) => (
    <div className="mb-4">
      <label
        htmlFor={fieldName}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        id={fieldName}
        {...register(fieldName as any)}
        className="mt-1 p-4 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center fixed top-0 left-0 z-[1000] w-full h-full">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="main-container">
      {/* Breadcrumb */}
      <div className="py-2">
        <Breadcrumb />
      </div>

      <div className="flex">
        <div className="w-[25%] px-2">
          <div className="mt-5">
            <div className="py-4">
              <div className="mb-8">
                <UserSummaryDisplay
                  avatar={profileData?.profilePicture!}
                  firstname={`${user?.firstName || ""}`}
                  lastname={`${user?.lastName || ""}`}
                  email={user?.email || ""}
                />
              </div>
              <Navigation />
            </div>
          </div>
        </div>
        <div className="w-[75%] px-2">
          <div className="mt-5">
            <div className="flex gap-2">
              <div className="w-[25%]">
                <div className="ps-4">
                  <h3 className="font-semibold text-black text-md mb-6">
                    Profile Settings
                  </h3>
                  <div className="space-y-2">
                    {settingsMenu?.map((item) => {
                      const isActive = activeTab === item.tab;
                      return (
                        <a
                          key={item?.tab}
                          className={`block px-3 py-2 font-normal text-sm transition cursor-pointer rounded-md ${
                            isActive
                              ? "bg-blue-100 text-blue-600"
                              : "hover:bg-slate-50 text-slate-600"
                          }`}
                          onClick={() => handleSwitcgTab(item?.tab)}
                        >
                          <span>{item?.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="w-[75%]">
                <div className="ps-4">
                  {/* <h1 className="text-xl font-semibold text-gray-800 mb-6">
                    Image Uploads
                  </h1> */}

                  {activeTab === "image-uploads" && (
                    <section className="mb-6 space-y-4">
                      <div>
                        <h2 className="font-semibold text-black text-md mb-4">
                          Upload profile image
                        </h2>
                        <p className="font-normal text-gray-500 text-sm mb-0">
                          This image will be used as your main profile picture.
                        </p>
                        <p className="font-normal text-gray-500 text-sm mb-4">
                          Use Atleast 800x800 pixel jpg, jpeg or png image.
                        </p>
                        <UploadSinglePage
                          sourceImage={profileData?.profilePicture}
                        />
                      </div>
                      <div>
                        <h2 className="font-semibold text-black text-md mb-4">
                          Upload profile photos
                        </h2>
                        <p className="font-normal text-gray-500 text-sm mb-0">
                          Add up to 5 photos to showcase your profile better.
                        </p>
                        <p className="font-normal text-gray-500 text-sm mb-4">
                          Use Atleast 1000x1000 pixel jpg, jpeg or png images.
                        </p>
                        <UploadMultiplePage
                          sourceImages={profileData?.profilePhotos}
                        />
                      </div>
                    </section>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Image uploads */}

                    {/* --- Personal Details Section --- */}
                    {activeTab === "personal-details" && (
                      <section className="mb-6">
                        <h2 className="font-semibold text-black text-md mb-4">
                          Profile Picture
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderTextField("First Name", "firstName", "John")}
                          {renderTextField("Last Name", "lastName", "Doe")}
                          {renderTextField(
                            "Height (cm)",
                            "height",
                            "e.g., 175",
                            "number"
                          )}
                          {renderTextField(
                            "Weight (kg)",
                            "weight",
                            "e.g., 70",
                            "number"
                          )}
                          {renderSelectField("Complexion", "complexion", [
                            "Fair",
                            "Wheatish",
                            "Dark",
                            "Olive",
                            "Not Specified",
                          ])}
                          {renderSelectField("Body Type", "bodyType", [
                            "Slim",
                            "Athletic",
                            "Average",
                            "Heavy",
                            "Not Specified",
                          ])}
                          {renderTextField(
                            "Mother Tongue",
                            "motherTongue",
                            "e.g., Malayalam"
                          )}
                          {renderSelectField(
                            "Marital Status",
                            "maritalStatus",
                            [
                              "Never Married",
                              "Divorced",
                              "Widowed",
                              "Annulled",
                              "Not Specified",
                            ]
                          )}
                          {renderTextField(
                            "Children",
                            "children",
                            "Number of children",
                            "number"
                          )}
                          {renderSelectField(
                            "Disability Status",
                            "disabilityStatus",
                            [
                              "No Disability",
                              "Physical Disability",
                              "Visual Impairment",
                              "Hearing Impairment",
                              "Other",
                              "Not Specified",
                            ]
                          )}
                        </div>
                        <div className="mt-3">
                          {renderTextField(
                            "About Me",
                            "aboutMe",
                            "Tell us about yourself...",
                            "textarea"
                          )}
                        </div>
                      </section>
                    )}

                    {/* --- Education & Career Section --- */}
                    {activeTab === "education-and-career" && (
                      <section className="mb-6">
                        <h2 className="font-semibold text-black text-md mb-4">
                          Education & Career
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderTextField(
                            "Education Level",
                            "educationLevel",
                            "e.g., Bachelors"
                          )}
                          {renderTextField(
                            "Education Field",
                            "educationField",
                            "e.g., Computer Science"
                          )}
                          {renderTextField(
                            "Occupation",
                            "occupation",
                            "e.g., Software Engineer"
                          )}
                          {renderTextField(
                            "Annual Income",
                            "annualIncome",
                            "e.g., 1200000",
                            "number"
                          )}
                        </div>
                      </section>
                    )}

                    {/* --- Location & Residency Section --- */}
                    {activeTab === "location-and-residency" && (
                      <section className="mb-6">
                        <h2 className="font-semibold text-black text-md mb-4">
                          Location & Residency
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderTextField("Country", "country", "e.g., India")}
                          {renderTextField("State", "state", "e.g., Kerala")}
                          {renderTextField("City", "city", "e.g., Kochi")}
                          {renderTextField(
                            "Zip Code",
                            "zipCode",
                            "e.g., 682001"
                          )}
                          {renderTextField(
                            "Residency Status",
                            "residencyStatus",
                            "e.g., Citizen"
                          )}
                        </div>
                      </section>
                    )}

                    {/* --- Family Details Section --- */}
                    {activeTab === "family-details" && (
                      <section className="mb-6">
                        <h2 className="font-semibold text-black text-md mb-4">
                          Family Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderSelectField("Family Type", "familyType", [
                            "Nuclear",
                            "Joint",
                            "Other",
                            "Not Specified",
                          ])}
                          {renderSelectField("Family Status", "familyStatus", [
                            "Rich",
                            "Upper Middle Class",
                            "Middle Class",
                            "Lower Middle Class",
                            "Not Specified",
                          ])}
                          {renderTextField(
                            "Father Occupation",
                            "fatherOccupation",
                            "e.g., Engineer"
                          )}
                          {renderTextField(
                            "Mother Occupation",
                            "motherOccupation",
                            "e.g., Homemaker"
                          )}
                          {renderTextField(
                            "Brothers",
                            "brothers",
                            "Number of brothers",
                            "number"
                          )}
                          {renderTextField(
                            "Sisters",
                            "sisters",
                            "Number of sisters",
                            "number"
                          )}
                          {renderTextField(
                            "Brothers Married",
                            "brothersMarried",
                            "Number of brothers married",
                            "number"
                          )}
                          {renderTextField(
                            "Sisters Married",
                            "sistersMarried",
                            "Number of sisters married",
                            "number"
                          )}
                          {renderTextField(
                            "Family Values",
                            "familyValues",
                            "e.g., Moderate"
                          )}
                        </div>
                      </section>
                    )}

                    {/* --- Lifestyle Section --- */}
                    {activeTab === "lifestyle" && (
                      <section className="mb-6">
                        <h2 className="font-semibold text-black text-md mb-4">
                          Lifestyle
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderSelectField("Diet", "diet", [
                            "Vegetarian",
                            "Non-Vegetarian",
                            "Eggetarian",
                            "Not Specified",
                          ])}
                          {renderSelectField("Smoking Habit", "smokingHabit", [
                            "No",
                            "Occasional",
                            "Regular",
                            "Not Specified",
                          ])}
                          {renderSelectField(
                            "Drinking Habit",
                            "drinkingHabit",
                            ["No", "Occasional", "Regular", "Not Specified"]
                          )}
                          {/* For array fields, you can use a simple text input and split the string on submission */}
                          {renderTextField(
                            "Hobbies",
                            "hobbies",
                            "e.g., traveling, reading, hiking"
                          )}
                          {renderTextField(
                            "Interests",
                            "interests",
                            "e.g., movies, music, sports"
                          )}
                        </div>
                      </section>
                    )}

                    {/* --- Horoscope Details Section --- */}
                    {activeTab === "horoscope-details" && (
                      <section className="mb-6">
                        <h2 className="font-semibold text-black text-md mb-4">
                          Horoscope Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderTextField("Star", "star", "e.g., Karthika")}
                          {renderTextField("Rasi", "rasi", "e.g., Vrishabha")}
                          {renderTextField(
                            "Nakshatra",
                            "nakshatra",
                            "e.g., Bharani"
                          )}
                          {renderTextField(
                            "Birth Time",
                            "birthTime",
                            "e.g., 10:30 AM"
                          )}
                          {renderTextField(
                            "Birth Place",
                            "birthPlace",
                            "e.g., Kochi, Kerala, India"
                          )}
                          {renderTextField(
                            "Horoscope Document URL",
                            "horoscopeDocument",
                            "e.g., url_to_horoscope.pdf"
                          )}
                        </div>
                      </section>
                    )}

                    {/* --- Profile Visibility & Photos Section --- */}
                    {activeTab === "profile-privacy" && (
                      <section className="mb-6">
                        <h2 className="font-semibold text-black text-md mb-4">
                          Profile Visibility & Photos
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderSelectField("Visibility", "visibility", [
                            "public",
                            "private",
                            "hidden",
                          ])}
                          {renderTextField(
                            "Profile Picture URL",
                            "profilePicture",
                            "e.g., url_to_main_profile_picture.jpg"
                          )}
                          {/* For array fields, use a text input and split on submission */}
                          {renderTextField(
                            "Profile Photo URLs",
                            "profilePhotos",
                            "e.g., url1.jpg, url2.jpg"
                          )}
                        </div>
                      </section>
                    )}

                    {/* --- Partner Preferences Section --- */}
                    {activeTab === "partner-preferences" && (
                      <section className="mb-6">
                        <h2 className="font-semibold text-black text-md mb-4">
                          Partner Preferences
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Controller
                            name="partnerPreferences.minAge"
                            control={control}
                            render={({ field }) => (
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                  Min Age
                                </label>
                                <input
                                  {...field}
                                  type="number"
                                  placeholder="e.g., 25"
                                  className="mt-1 p-4 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                            )}
                          />
                          <Controller
                            name="partnerPreferences.maxAge"
                            control={control}
                            render={({ field }) => (
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                  Max Age
                                </label>
                                <input
                                  {...field}
                                  type="number"
                                  placeholder="e.g., 30"
                                  className="mt-1 p-4 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                            )}
                          />
                          {/* Corrected implementation using Controller for nested annualIncome object */}
                          <Controller
                            name="partnerPreferences.annualIncome.min"
                            control={control}
                            render={({ field }) => (
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                  Min Annual Income
                                </label>
                                <input
                                  {...field}
                                  type="number"
                                  placeholder="e.g., 500000"
                                  className="mt-1 p-4 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                            )}
                          />
                          <Controller
                            name="partnerPreferences.annualIncome.max"
                            control={control}
                            render={({ field }) => (
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                  Max Annual Income
                                </label>
                                <input
                                  {...field}
                                  type="number"
                                  placeholder="e.g., 1000000"
                                  className="mt-1 p-4 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                            )}
                          />
                          {/* Other partner preference fields */}
                          {renderTextField(
                            "Partner Religion",
                            "partnerPreferences.religion",
                            "e.g., Hindu, Christian"
                          )}
                          {renderTextField(
                            "Partner Community",
                            "partnerPreferences.community",
                            "e.g., Reddy, Nair"
                          )}
                          {renderTextField(
                            "Partner Mother Tongue",
                            "partnerPreferences.motherTongue",
                            "e.g., English, Malayalam"
                          )}
                          {renderTextField(
                            "Partner Country",
                            "partnerPreferences.country",
                            "e.g., India, USA"
                          )}
                          {renderTextField(
                            "Partner Education Level",
                            "partnerPreferences.educationLevel",
                            "e.g., Bachelors, Masters"
                          )}
                          {renderTextField(
                            "Partner Occupation",
                            "partnerPreferences.occupation",
                            "e.g., Software Engineer, Doctor"
                          )}
                          {renderTextField(
                            "Partner Diet",
                            "partnerPreferences.diet",
                            "e.g., Vegetarian"
                          )}
                          {renderTextField(
                            "Partner Smoking Habit",
                            "partnerPreferences.smokingHabit",
                            "e.g., No"
                          )}
                          {renderTextField(
                            "Partner Drinking Habit",
                            "partnerPreferences.drinkingHabit",
                            "e.g., No"
                          )}
                          {renderTextField(
                            "Partner Marital Status",
                            "partnerPreferences.maritalStatus",
                            "e.g., Never Married"
                          )}
                          {renderTextField(
                            "Partner Body Type",
                            "partnerPreferences.bodyType",
                            "e.g., Average"
                          )}
                          {renderTextField(
                            "Partner Complexion",
                            "partnerPreferences.complexion",
                            "e.g., Fair"
                          )}
                          {renderTextField(
                            "Partner Disability Status",
                            "partnerPreferences.disabilityStatus",
                            "e.g., No Disability"
                          )}
                          {renderTextField(
                            "Partner Family Type",
                            "partnerPreferences.familyType",
                            "e.g., Nuclear"
                          )}
                          {renderTextField(
                            "Partner Family Status",
                            "partnerPreferences.familyStatus",
                            "e.g., Middle Class"
                          )}
                          {renderTextField(
                            "Partner Family Values",
                            "partnerPreferences.familyValues",
                            "e.g., Moderate"
                          )}
                        </div>
                      </section>
                    )}

                    {/* --- Submission and Status --- */}
                    <div className="mt-8">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Profile"}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
