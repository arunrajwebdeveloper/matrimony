import React from "react";

function Avatar({
  src,
  firstname = "",
  lastname = "",
  size = 50,
  isCircle = true,
  hasBorder = true,
}: {
  src: string | undefined;
  firstname: string;
  lastname: string;
  size?: number;
  isCircle?: boolean;
  hasBorder?: boolean;
}) {
  const colors = [
    "bg-green-500",
    "bg-fuchsia-500",
    "bg-emerald-500",
    "bg-lime-500",
    "bg-amber-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-violet-500",
    "bg-blue-500",
    "bg-sky-500",
    "bg-orange-500",
    "bg-red-500",
  ];

  const getInitials = () => {
    const firstInitial = firstname ? firstname.charAt(0).toUpperCase() : "";
    const lastInitial = lastname ? lastname.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  };

  const getBackgroundColor = () => {
    const fullName = firstname + lastname;
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const border = hasBorder ? "border-2 border-slate-50" : "";

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`${border} object-cover flex-none overflow-hidden select-none bg-slate-400`}
        loading="lazy"
        style={{
          width: size,
          height: size,
          borderRadius: isCircle ? "50%" : "0",
        }}
      />
    );
  }

  return (
    <div
      className={`${getBackgroundColor()} ${border} text-white flex items-center justify-center flex-none font-normal`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        borderRadius: isCircle ? "50%" : "0",
      }}
    >
      {getInitials()}
    </div>
  );
}

export default Avatar;
