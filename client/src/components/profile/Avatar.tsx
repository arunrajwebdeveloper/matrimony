import React from "react";

function Avatar({
  src,
  firstname = "",
  lastname = "",
  size = 50,
}: {
  src: string | undefined;
  firstname: string;
  lastname: string;
  size: number;
}) {
  const colors = [
    "bg-green-600",
    "bg-fuchsia-600",
    "bg-emerald-600",
    "bg-lime-600",
    "bg-amber-600",
    "bg-teal-600",
    "bg-cyan-600",
    "bg-violet-600",
    "bg-blue-600",
    "bg-sky-600",
    "bg-orange-600",
    "bg-red-600",
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

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="object-cover flex-none rounded-full overflow-hidden select-none border-2 border-slate-50 bg-slate-400"
        loading="lazy"
        style={{
          width: size,
          height: size,
        }}
      />
    );
  }

  return (
    <div
      className={`${getBackgroundColor()} rounded-full text-white flex items-center justify-center flex-none font-normal border-2 border-slate-50`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
    >
      {getInitials()}
    </div>
  );
}

export default Avatar;
