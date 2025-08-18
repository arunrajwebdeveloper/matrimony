import React from "react";

interface ToggleProps {
  disabled?: boolean;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function ToggleSwitch({
  disabled = false,
  name = "toggle",
  size = "md",
  onChange,
}: ToggleProps) {
  const sizeClasses = {
    sm: {
      label: "w-8 h-5 rounded-full",
      thumb: "after:w-[14px] after:h-[14px] after:rounded-full",
      position: "after:top-[3px] after:left-[3px]",
      activeWidth: "active:after:w-[18px] peer-disabled:after:!w-[14px]",
      checkedPosition:
        "peer-checked:after:left-[calc(100%-3px)] peer-checked:after:translate-x-[-100%]",
    },
    md: {
      label: "w-10 h-6 rounded-full",
      thumb: "after:w-4.5 after:h-4.5 after:rounded-full",
      position: "after:top-[3px] after:left-[3px]",
      activeWidth: "active:after:w-[22px] peer-disabled:after:!w-4.5",
      checkedPosition:
        "peer-checked:after:left-[calc(100%-3px)] peer-checked:after:translate-x-[-100%]",
    },

    lg: {
      label: "w-14 h-8 rounded-full",
      thumb: "after:w-6 after:h-6 after:rounded-full",
      position: "after:top-[4px] after:left-[4px]",
      activeWidth: "active:after:w-[30px] peer-disabled:after:!w-6",
      checkedPosition:
        "peer-checked:after:left-[calc(100%-4px)] peer-checked:after:translate-x-[-100%]",
    },
    xl: {
      label: "w-16 h-9 rounded-full",
      thumb: "after:w-7 after:h-7 after:rounded-full",
      position: "after:top-[4px] after:left-[4px]",
      activeWidth: "active:after:w-[34px] peer-disabled:after:!w-7",
      checkedPosition:
        "peer-checked:after:left-[calc(100%-4px)] peer-checked:after:translate-x-[-100%]",
    },
  };

  const currentSizeClasses = sizeClasses[size] || sizeClasses.md;

  const labelClasses = `
    relative text-[0px] bg-slate-500 block transition cursor-pointer peer-disabled:opacity-50
    peer-disabled:cursor-default peer-checked:bg-green-500 indent-[-9999px]
    after:content-[''] after:absolute after:bg-white after:shadow-md
    after:transition-all after:duration-300
    ${currentSizeClasses.label}
    ${currentSizeClasses.thumb}
    ${currentSizeClasses.position}
    ${currentSizeClasses.activeWidth}
    ${currentSizeClasses.checkedPosition}
  `;

  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        id={name}
        className="w-0 h-0 hidden opacity-0 peer"
        disabled={disabled}
        onChange={onChange}
      />
      <label
        className={labelClasses}
        // className="relative text-[0px] block w-44 h-25 rounded-[100px] bg-slate-500 transition cursor-pointer peer-disabled:opacity-50 peer-disabled:cursor-default peer-checked:bg-green-500 indent-[-9999px] after:content-[''] after:absolute after:top-[5px] after:left-[5px] after:w-[90px] after:h-[90px] after:bg-white after:rounded-[90px] after:transition-all after:duration-300 active:after:w-[100px] peer-disabled:after:!w-[90px] peer-checked:after:left-[calc(100%-5px)] peer-checked:after:translate-x-[-100%]"
        htmlFor={name}
      >
        Toggle
      </label>
    </div>
  );
}

export default ToggleSwitch;
