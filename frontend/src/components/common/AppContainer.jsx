import React, { useState } from "react";
import { Smartphone, Monitor } from "lucide-react";

export const AppContainer = ({ children }) => {
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start sm:py-6 selection:bg-fastor-orange selection:text-white">
      {/* Viewport switch toolbar for interviewers/reviewers on larger screens */}

      {/* <div className="hidden sm:flex items-center justify-between w-full max-w-[430px] mb-3 px-3 text-xs text-gray-500 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Fastor Mobile Preview</span>
        </div>
        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-gray-200 shadow-sm">
          <button
            type="button"
            onClick={() => setIsMobileFrame(true)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition ${
              isMobileFrame
                ? "bg-fastor-orange text-white font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Figma View</span>
          </button>
          <button
            type="button"
            onClick={() => setIsMobileFrame(false)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition ${
              !isMobileFrame
                ? "bg-fastor-orange text-white font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Wide</span>
          </button>
        </div>
      </div> */}

      {/* Main app container */}
      <div
        className={`w-full bg-white transition-all duration-300 min-h-48 flex flex-col no-scrollbar ${
          isMobileFrame
            ? "sm:max-w-[412px] sm:max-h-[727px] sm:h-[727px] sm:rounded-[44px] sm:shadow-2xl sm:border-[10px] sm:border-slate-800 sm:overflow-y-auto no-scrollbar relative"
            : "max-w-4xl sm:rounded-2xl sm:shadow-xl sm:border sm:border-gray-200 sm:overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
};
