import React from "react";
import { Check, Shield } from "lucide-react";

function SafeTipsSidebarCard() {
  return (
    <div className="bg-green-100 relative overflow-hidden rounded-2xl border border-green-200 p-8 w-full transition-all duration-300">
      <div className="absolute -bottom-16 left-1/2 text-green-500/20 z-0">
        <Shield size={260} />
      </div>
      <div className=" relative z-10">
        <h2 className="text-sm font-medium text-green-700 mb-4">Stay Safe</h2>
        <div className="space-y-1">
          <p className="flex gap-2 text-xs text-slate-600">
            <Check size={12} color="green" className="flex-none mt-1" />
            <span>Never share personal information</span>
          </p>
          <p className="flex gap-2 text-xs text-slate-600">
            <Check size={12} color="green" className="flex-none mt-1" />
            <span>Meet only in public, safe, and well-lit places</span>
          </p>
          <p className="flex gap-2 text-xs text-slate-600">
            <Check size={12} color="green" className="flex-none mt-1" />
            <span>Report any suspicious or fake profiles immediately</span>
          </p>
          <p className="flex gap-2 text-xs text-slate-600">
            <Check size={12} color="green" className="flex-none mt-1" />
            <span>Keep chats on the platform until you feel comfortable</span>
          </p>
          <p className="flex gap-2 text-xs text-slate-600">
            <Check size={12} color="green" className="flex-none mt-1" />
            <span>Avoid sharing financial details</span>
          </p>
          <p className="flex gap-2 text-xs text-slate-600">
            <Check size={12} color="green" className="flex-none mt-1" />
            <span>Respect both your own and others boundaries</span>
          </p>
          <p className="flex gap-2 text-xs text-slate-600">
            <Check size={12} color="green" className="flex-none mt-1" />
            <span>
              Verify identities through a quick video call before meeting
            </span>
          </p>
          <p className="flex gap-2 text-xs text-slate-600">
            <Check size={12} color="green" className="flex-none mt-1" />
            <span>
              Inform a trusted friend or family before meeting someone
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SafeTipsSidebarCard;
