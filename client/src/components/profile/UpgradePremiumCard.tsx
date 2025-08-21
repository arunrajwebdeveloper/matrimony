import { Check, Crown } from "lucide-react";
import React from "react";

function UpgradePremiumCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full transition-all duration-300">
      <div className="flex justify-center mb-4">
        <Crown size={80} color="orange" fill="orange" />
      </div>
      <h2 className="text-sm font-medium text-gray-800 text-center mb-4">
        Upgrade to Premium
      </h2>
      <div className="space-y-1">
        <p className="flex items-center gap-2 text-xs text-slate-600 text-center justify-center">
          <Check size={12} color="green" />
          <span>Unlimited messaging</span>
        </p>
        <p className="flex items-center gap-2 text-xs text-slate-600 text-center justify-center">
          <Check size={12} color="green" />
          <span>Advanced search</span>
        </p>
        <p className="flex items-center gap-2 text-xs text-slate-600 text-center justify-center">
          <Check size={12} color="green" />
          <span>Profile priority</span>
        </p>
        <p className="flex items-center gap-2 text-xs text-slate-600 text-center justify-center">
          <Check size={12} color="green" />
          <span>Contact details access</span>
        </p>
        <p className="flex items-center gap-2 text-xs text-slate-600 text-center justify-center">
          <Check size={12} color="green" />
          <span>Ad-free experience</span>
        </p>
      </div>
      <div className="mt-5">
        <a
          className="flex items-center justify-center px-2.5 py-2 rounded-full text-white bg-orange-400 font-medium text-xs"
          href=""
        >
          Upgrade Now
        </a>
      </div>
    </div>
  );
}

export default UpgradePremiumCard;
