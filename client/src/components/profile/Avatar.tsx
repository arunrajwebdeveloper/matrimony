import React from "react";

function Avatar({ src }: { src: string | undefined }) {
  return (
    <img
      src={src}
      alt=""
      className="object-cover w-[50px] h-[50px] rounded-[50%] overflow-hidden select-none border-[1px] border-slate-50"
      loading="lazy"
    />
  );
}

export default Avatar;
