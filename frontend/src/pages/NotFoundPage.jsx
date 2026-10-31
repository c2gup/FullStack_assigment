import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white min-h-[500px]">
      <div className="w-16 h-16 rounded-full bg-orange-50 text-fastor-orange flex items-center justify-center mb-4">
        <Home className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-fastor-dark">Page Not Found</h1>
      <p className="text-xs text-gray-500 mt-2 max-w-xs">
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/restaurants')}
        className="mt-6 px-6 py-2.5 bg-fastor-orange text-white text-xs font-bold rounded-xl shadow-button hover:bg-fastor-orange-hover transition"
      >
        Go to Restaurants
      </button>
    </div>
  );
};
