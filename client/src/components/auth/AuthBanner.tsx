"use client";

import React from "react";
import { usePathname } from "next/navigation";

function AuthBanner() {
  const path = usePathname();

  const url =
    {
      "/login": {
        quote: "Your journey to forever begins here",
        image: "/auth/image-1.jpg",
      },
      "/register": {
        quote: " Let's find your happily ever after",
        image: "/auth/image-2.jpg",
      },
      "/forgot-password": {
        quote: "Let's get you back on track",
        image: "/auth/image-3.jpg",
      },
      "/reset-password": {
        quote: "Let's get you back on track",
        image: "/auth/image-4.jpg",
      },
    }[path] || {};

  return (
    <>
      <div className="relative z-20 px-10 max-w-3xl">
        <h2 className="text-5xl text-white font-semibold mb-4">{url?.quote}</h2>
        <p className="text-lg text-white font-normal m-0">
          Join a vibrant community of individuals who are ready to find their
          soulmate. Every connection you make here brings you one step closer to
          your forever.
        </p>
      </div>

      <img
        className="w-full h-full absolute top-0 left-0 object-cover z-10"
        src={url?.image || ""}
        alt="Auth banner image"
      />
    </>
  );
}

export default AuthBanner;
