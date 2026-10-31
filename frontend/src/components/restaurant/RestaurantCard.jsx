import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, ChevronRight } from 'lucide-react';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
];

export const RestaurantCard = ({ restaurant, index = 0 }) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(
    restaurant.logo || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
  );
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]);
    }
  };

  const cleanAddress =
    !restaurant.address_complete || restaurant.address_complete === 'null'
      ? 'Model Town, New Delhi, India'
      : restaurant.address_complete;

  const handleClick = () => {
    navigate(`/restaurant/${restaurant.restaurant_id}`, {
      state: { restaurant },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-3xl p-3.5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center space-x-3.5 mb-3"
    >
      {/* Restaurant Image / Logo */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
        <img
          src={imgSrc}
          alt={restaurant.restaurant_name}
          onError={handleImageError}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          <span>4.{((index % 6) + 3)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h3 className="text-base font-bold text-fastor-dark truncate group-hover:text-fastor-orange transition-colors">
            {restaurant.restaurant_name}
          </h3>
          <span className="text-[11px] font-bold text-fastor-orange shrink-0">
            ₹{150 + ((index * 25) % 300)}.00
          </span>
        </div>

        {/* Address */}
        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="truncate">{cleanAddress}</span>
        </p>

        {/* Metadata info */}
        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
          <span className="flex items-center gap-0.5">
            <Clock className="w-3 h-3" />
            20-30 min
          </span>
          <span>•</span>
          <span>North Indian, Fast Food</span>
        </div>

        {/* Action pills matching Figma Screen 3 */}
        <div className="flex items-center gap-2 mt-2 pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="px-3 py-1 bg-fastor-orange text-white text-[11px] font-semibold rounded-full shadow-xs hover:bg-fastor-orange-hover active:scale-95 transition"
          >
            Order Now
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              // In Figma it has "Track Driver" pill
              alert(`Tracking order status for ${restaurant.restaurant_name}`);
            }}
            className="px-3 py-1 bg-fastor-orange-light text-fastor-orange text-[11px] font-semibold rounded-full hover:bg-fastor-orange-muted active:scale-95 transition"
          >
            Track Driver
          </button>
        </div>
      </div>

      {/* Chevron indicator */}
      <div className="hidden sm:block text-gray-300 group-hover:text-fastor-orange transition">
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
};
