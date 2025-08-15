import React from "react";

function Avatar({ src }: { src: string | undefined }) {
  return (
    <img
      src={src}
      alt=""
      className="object-cover w-[50px] h-[50px] rounded-md overflow-hidden"
      loading="lazy"
    />
  );
}

export default Avatar;
