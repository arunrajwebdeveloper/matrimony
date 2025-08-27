import React from "react";
import { Check, Lightbulb, Sun } from "lucide-react";

function InfoSidebarCard() {
  return (
    <div className="bg-blue-100 relative overflow-hidden rounded-2xl border border-blue-200 p-8 w-full transition-all duration-300">
      <div className="absolute -bottom-28 -left-1/2 text-blue-500/20 z-0">
        <Sun size={260} />
      </div>
      <div className=" relative z-10">
        <h2 className="text-sm font-medium text-blue-700 mb-4">Profile Tips</h2>
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Check size={12} color="green" />
            <span>Add a genuine smile photo</span>
          </p>
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Check size={12} color="green" />
            <span>Write an engaging bio</span>
          </p>
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Check size={12} color="green" />
            <span>Update regularly</span>
          </p>
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Check size={12} color="green" />
            <span>Be honest about details</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoSidebarCard;
