import { useState, useEffect } from "react";
import { UserCheck, Star } from "lucide-react";
import Link from "next/link";

// Define the shape of the user's profile data
interface UserProfile {
  fullName: string;
  email: string;
  dateOfBirth: string;
  profilePictureUrl: string | null;
  address: string;
  city: string;
  bio: string;
}

// Define the props for the progress circle component
interface ProgressCircleProps {
  percentage: number;
}

const ProfileCompletionCircle: React.FC<ProgressCircleProps> = ({
  percentage,
}) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
        <defs>
          <linearGradient
            id="progress-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" style={{ stopColor: "rgb(124, 58, 237)" }} />
            {/* Start color (indigo) */}
            <stop
              offset="100%"
              style={{ stopColor: "rgb(236, 72, 153)" }}
            />{" "}
            {/* End color (pink) */}
          </linearGradient>
        </defs>

        {/* Background Circle */}
        <circle
          className="text-gray-200"
          strokeWidth="5"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        {/* Progress Circle */}
        <circle
          className="text-indigo-600 transition-all duration-1000 ease-in-out"
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          // stroke="currentColor"
          stroke="url(#progress-gradient)"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
      </svg>
      {/* Percentage Text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl  font-medium text-gray-800 ">
          {Math.round(percentage)}%
        </span>
        <span className="text-xs text-gray-500">Completed</span>
      </div>
    </div>
  );
};

// Main App component to demonstrate the widget
const ProfileCompletionCard = () => {
  const [profileData, setProfileData] = useState<UserProfile>({
    fullName: "John Doe",
    email: "john.doe@example.com",
    dateOfBirth: "1990-01-01",
    profilePictureUrl: null, // This field is missing
    address: "",
    city: "", // This field is missing
    bio: "A short bio about myself.",
  });

  const [completionPercentage, setCompletionPercentage] = useState<number>(0);

  useEffect(() => {
    // --- Profile Completion Logic ---
    // Define the fields you want to track for completion.
    // This is where you would customize the logic.
    const fieldsToTrack: Array<keyof UserProfile> = [
      "fullName",
      "email",
      "dateOfBirth",
      "profilePictureUrl",
      "address",
      "city",
      "bio",
    ];

    let completedFields = 0;
    fieldsToTrack.forEach((field) => {
      // Check if the field exists and is not an empty string or null.
      // TypeScript's keyof operator ensures this is type-safe.
      const value = profileData[field];
      if (value !== null && value !== "" && value !== undefined) {
        completedFields++;
      }
    });

    const totalFields = fieldsToTrack.length;
    const calculatedPercentage = (completedFields / totalFields) * 100;
    setCompletionPercentage(calculatedPercentage);
  }, [profileData]); // Recalculate whenever profileData changes

  return (
    <div className="flex items-center justify-center antialiased">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full transition-all duration-300">
        <div>
          <h1 className="text-sm font-medium text-gray-800 text-center">
            Complete your profile
          </h1>
          {completionPercentage === 100 && (
            <Star className="text-yellow-500" size={28} fill="currentColor" />
          )}
        </div>

        <div className="flex items-center justify-center">
          <ProfileCompletionCircle percentage={completionPercentage} />
        </div>
        <p className="text-xs text-gray-400 text-center mb-4">
          Add basic informations to get more attention.
        </p>
        <div>
          <Link
            className="flex items-center justify-center border-2 border-blue-600 px-2.5 py-2 rounded-full text-blue-600 font-medium text-xs"
            href="/profile"
          >
            Complete now
          </Link>
        </div>

        {/* <div className="">
          <h2 className="text-md font-medium text-gray-700 ">Your Progress</h2>
          <div className="bg-gray-50 rounded-lg p-4 transition-all duration-300">
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
              <span>Basic Information</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {profileData.fullName &&
                profileData.email &&
                profileData.dateOfBirth
                  ? "Complete"
                  : "Incomplete"}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 transition-all duration-300">
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
              <span>About Me</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {profileData.bio ? "Complete" : "Incomplete"}
              </span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProfileCompletionCard;
