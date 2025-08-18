import React from "react";

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  name?: string;
}

function ToggleSwitch({
  disabled = false,
  name = "toggle",
  ...rest
}: ToggleProps) {
  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        id={name}
        className="w-0 h-0 hidden opacity-0 peer"
        disabled={disabled}
        {...rest}
      />
      <label
        className="relative text-[0px] block w-44 h-25 rounded-[100px] bg-slate-500 transition cursor-pointer peer-disabled:opacity-50 peer-disabled:cursor-default peer-checked:bg-green-500 indent-[-9999px] after:content-[''] after:absolute after:top-[5px] after:left-[5px] after:w-[90px] after:h-[90px] after:bg-white after:rounded-[90px] after:transition-all after:duration-300 active:after:w-[100px] peer-disabled:after:!w-[90px] peer-checked:after:left-[calc(100%-5px)] peer-checked:after:translate-x-[-100%]"
        htmlFor={name}
      >
        Toggle
      </label>
    </div>
  );
}

export default ToggleSwitch;
