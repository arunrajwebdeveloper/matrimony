import { Check, Crown } from "lucide-react";
import React from "react";

function UpgradePremiumCard() {
  return (
    <div className="bg-amber-100 overflow-hidden relative rounded-2xl border border-amber-200 p-8 w-full transition-all duration-300">
      <div className=" absolute -bottom-16 -right-1/2 text-amber-500/20 z-0">
        <Crown size={260} />
      </div>
      <div className=" relative z-10">
        <h2 className="text-sm font-medium text-amber-700 mb-4">
          Upgrade to Premium
        </h2>
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Check size={12} color="green" />
            <span>Unlimited messaging</span>
          </p>
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Check size={12} color="green" />
            <span>Advanced search</span>
          </p>
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Check size={12} color="green" />
            <span>Profile priority</span>
          </p>
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Check size={12} color="green" />
            <span>Contact details access</span>
          </p>
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Check size={12} color="green" />
            <span>Ad-free experience</span>
          </p>
        </div>
        <div className="mt-5">
          <a
            className="flex items-center justify-center px-2.5 py-3  rounded-full text-white bg-orange-400 font-medium text-xs"
            href=""
          >
            Upgrade Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default UpgradePremiumCard;
