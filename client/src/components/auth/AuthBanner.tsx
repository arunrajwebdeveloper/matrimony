"use client";

import React from "react";
import { usePathname } from "next/navigation";

function AuthBanner() {
  const path = usePathname();

  const url =
    {
      "/login": {
        quote: "Welcome back. Let’s make every second count.",
        image: "/auth/image-1.jpg",
      },
      "/register": {
        quote: "Time starts ticking the moment you begin.",
        image: "/auth/image-2.jpg",
      },
      "/reset-password": {
        quote: "Mistakes fade, but moments return — reset now.",
        image: "/auth/image-3.jpg",
      },
    }[path] || {};

  return (
    <>
      <div className="relative z-20 px-10 max-w-3xl">
        <h2 className="text-5xl text-white font-semibold mb-4">{url?.quote}</h2>
        <span className="text-lg text-white font-normal">
          Explore our exclusive collection of premium watches.
        </span>
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
