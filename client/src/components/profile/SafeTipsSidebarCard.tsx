import React from "react";
import { Check } from "lucide-react";

function SafeTipsSidebarCard() {
  return (
    <div className="bg-green-100 rounded-2xl border border-gray-100 px-8 py-4 w-full transition-all duration-300">
      <h2 className="text-sm font-medium text-gray-800 text-center mb-4">
        Stay Safe
      </h2>
      <div className="space-y-1">
        <p className="flex items-center gap-2 text-xs text-slate-600 text-center justify-center">
          <Check size={12} color="green" />
          <span>Never share personal info</span>
        </p>
        <p className="flex items-center gap-2 text-xs text-slate-600 text-center justify-center">
          <Check size={12} color="green" />
          <span>Meet in public places</span>
        </p>
        <p className="flex items-center gap-2 text-xs text-slate-600 text-center justify-center">
          <Check size={12} color="green" />
          <span>Report suspicious profiles</span>
        </p>
      </div>
    </div>
  );
}

export default SafeTipsSidebarCard;
