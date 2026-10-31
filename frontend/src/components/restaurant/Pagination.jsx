import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, totalCount, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-6 px-1 border-t border-gray-100 mt-2">
      <div className="text-xs text-gray-500 font-medium">
        Showing page <span className="font-bold text-fastor-dark">{currentPage}</span> of{' '}
        <span className="font-bold text-fastor-dark">{totalPages}</span> ({totalCount} total)
      </div>

      <div className="flex items-center space-x-1.5">
        {/* Previous Button */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`flex items-center justify-center w-8 h-8 rounded-xl border text-sm transition ${
            currentPage === 1
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95'
          }`}
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Number Buttons */}
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-fastor-orange text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`flex items-center justify-center w-8 h-8 rounded-xl border text-sm transition ${
            currentPage === totalPages
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95'
          }`}
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
