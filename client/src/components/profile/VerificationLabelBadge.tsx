import { ShieldCheck } from "lucide-react";
import React from "react";

function VerificationLabelBadge({
  item = false,
  hasLabel = true,
}: {
  item: boolean;
  hasLabel?: boolean;
}) {
  return (
    <span
      className={`${
        item ? "text-green-500" : "text-red-500 "
      } text-xs font-normal flex gap-1 items-center select-none`}
    >
      <ShieldCheck
        size={18}
        color="white"
        fill={item ? "#00c951" : "#fb2c36"}
      />
      {hasLabel && <span>{item ? "Verified" : "Not verified"}</span>}
    </span>
  );
}

export default VerificationLabelBadge;
