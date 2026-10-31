import React from 'react';
import { Wifi, Battery } from 'lucide-react';

export const StatusBar = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-between px-6 pt-3 pb-2 text-xs font-semibold select-none text-fastor-dark ${className}`}>
      <span>9:41</span>
      <div className="flex items-center space-x-1.5">
        {/* Cellular signal bars */}
        <div className="flex items-end space-x-0.5 h-3">
          <div className="w-0.5 h-1.5 bg-current rounded-sm"></div>
          <div className="w-0.5 h-2 bg-current rounded-sm"></div>
          <div className="w-0.5 h-2.5 bg-current rounded-sm"></div>
          <div className="w-0.5 h-3 bg-current rounded-sm"></div>
        </div>
        <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
        <Battery className="w-4 h-4" strokeWidth={2.5} />
      </div>
    </div>
  );
};
