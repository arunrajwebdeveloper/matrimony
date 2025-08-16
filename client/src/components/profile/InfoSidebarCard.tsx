import React from "react";
import { Check, Lightbulb } from "lucide-react";

function InfoSidebarCard() {
  return (
    <div className="bg-blue-100 rounded-2xl border border-gray-100 px-8 py-4 w-full transition-all duration-300">
      <h2 className="text-sm font-medium text-gray-800 text-center mb-4">
        Profile Tips
      </h2>
      <div className="space-y-1">
        <p className="flex items-center gap-2 text-xs text-slate-600 text-center justify-center">
          <Check size={12} color="green" />
          <span>Add a genuine smile photo</span>
        </p>
        <p className="flex items-center gap-2 text-xs text-slate-600 text-center justify-center">
          <Check size={12} color="green" />
          <span>Write an engaging bio</span>
        </p>
        <p className="flex items-center gap-2 text-xs text-slate-600 text-center justify-center">
          <Check size={12} color="green" />
          <span>Update regularly</span>
        </p>
        <p className="flex items-center gap-2 text-xs text-slate-600 text-center justify-center">
          <Check size={12} color="green" />
          <span>Be honest about details</span>
        </p>
      </div>
    </div>
  );
}

export default InfoSidebarCard;
