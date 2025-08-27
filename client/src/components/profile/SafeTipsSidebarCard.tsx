import React from "react";
import { Check, Shield } from "lucide-react";

function SafeTipsSidebarCard() {
  return (
    <div className="bg-green-100 relative overflow-hidden rounded-2xl border border-gray-100 p-8 w-full transition-all duration-300">
      <div className="absolute -bottom-28 left-1/2 text-green-500/20 z-0">
        <Shield size={260} />
      </div>
      <div className=" relative z-10">
        <h2 className="text-sm font-medium text-gray-800 mb-4">Stay Safe</h2>
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Check size={12} color="green" />
            <span>Never share personal info</span>
          </p>
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Check size={12} color="green" />
            <span>Meet in public places</span>
          </p>
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Check size={12} color="green" />
            <span>Report suspicious profiles</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SafeTipsSidebarCard;
