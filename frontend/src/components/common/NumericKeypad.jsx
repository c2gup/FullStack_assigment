import React from "react";
import { Delete } from "lucide-react";

export const NumericKeypad = ({ onKeyPress, onDelete, className = "" }) => {
  const keys = [
    { num: "1", sub: "" },
    { num: "2", sub: "ABC" },
    { num: "3", sub: "DEF" },
    { num: "4", sub: "GHI" },
    { num: "5", sub: "JKL" },
    { num: "6", sub: "MNO" },
    { num: "7", sub: "PQRS" },
    { num: "8", sub: "TUV" },
    { num: "9", sub: "WXYZ" },
    { num: "blank", sub: "" },
    { num: "0", sub: "" },
    { num: "delete", sub: "" },
  ];

  return (
    <div className={`bg-[#E8EAED] p-2 rounded-t-2xl select-none ${className}`}>
      <div className="grid grid-cols-3 gap-2">
        {keys.map((k, index) => {
          if (k.num === "blank") {
            return <div key={index} className="h-12" />;
          }

          if (k.num === "delete") {
            return (
              <button
                key={index}
                type="button"
                onClick={onDelete}
                className="h-12 flex items-center justify-center rounded-lg bg-white/70 active:bg-white text-gray-700 shadow-sm transition active:scale-95"
                aria-label="Delete"
              >
                <Delete className="w-5 h-5 text-gray-700" />
              </button>
            );
          }

          return (
            <button
              key={index}
              type="button"
              onClick={() => onKeyPress(k.num)}
              className="h-12 flex flex-col items-center justify-center rounded-lg bg-white active:bg-gray-100 shadow-sm transition active:scale-95 text-fastor-dark"
            >
              <span className="text-xl font-medium leading-none">{k.num}</span>
              {k.sub && (
                <span className="text-[9px] font-semibold tracking-wider text-gray-400 leading-none mt-0.5">
                  {k.sub}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
