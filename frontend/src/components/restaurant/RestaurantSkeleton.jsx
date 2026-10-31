import React from 'react';

export const RestaurantSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl p-3.5 border border-gray-100 shadow-sm flex items-center space-x-3.5 mb-3">
      {/* Thumbnail skeleton */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-200 animate-pulse shrink-0"></div>

      {/* Content skeleton */}
      <div className="flex-1 space-y-2 py-1">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded-md w-3/5 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/5 animate-pulse"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded-md w-4/5 animate-pulse"></div>
        <div className="h-3 bg-gray-100 rounded-md w-1/2 animate-pulse"></div>

        {/* Buttons skeleton */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const RestaurantSkeletonList = ({ count = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <RestaurantSkeleton key={i} />
      ))}
    </div>
  );
};
