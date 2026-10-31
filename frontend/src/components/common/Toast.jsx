import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-fastor-dark text-white',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-white" />,
    error: <AlertCircle className="w-5 h-5 flex-shrink-0 text-white" />,
    info: <Info className="w-5 h-5 flex-shrink-0 text-white" />,
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm transition-all animate-bounce-short">
      <div
        className={`flex items-center justify-between p-3.5 rounded-xl shadow-lg ${
          bgStyles[type] || bgStyles.info
        }`}
      >
        <div className="flex items-center space-x-2.5 pr-2">
          {icons[type] || icons.info}
          <p className="text-xs font-medium leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-lg transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
