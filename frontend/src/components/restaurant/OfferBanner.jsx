import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OFFERS = [
  {
    id: 1,
    tagline: 'Experience our delicious new dish',
    discount: '30% OFF',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80',
    targetId: '75',
  },
  {
    id: 2,
    tagline: 'Freshly Baked Artisan Pizzas',
    discount: 'FLAT 40% OFF',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80',
    targetId: '74',
  },
  {
    id: 3,
    tagline: 'Weekend Family Special Feasts',
    discount: 'BUY 1 GET 1',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80',
    targetId: '68',
  },
];

export const OfferBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const current = OFFERS[currentIndex];

  return (
    <div className="my-4">
      {/* Banner Card */}
      <div
        onClick={() => navigate(`/restaurant/${current.targetId}`)}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#F9501B] via-[#F24614] to-[#E33B0B] text-white shadow-card cursor-pointer transition-transform duration-300 active:scale-[0.99] h-36 flex items-center"
      >
        {/* Decorative background yellow curves matching Figma */}
        <div className="absolute -top-10 -left-6 w-28 h-28 rounded-full border-[10px] border-[#FFD066]/40 pointer-events-none"></div>
        <div className="absolute -bottom-8 left-4 w-20 h-20 rounded-full border-[8px] border-[#FFD066]/30 pointer-events-none"></div>

        {/* Text Section */}
        <div className="relative z-10 w-1/2 pl-5 pr-1 flex flex-col justify-center">
          <p className="text-xs font-medium text-white/95 leading-tight mb-1">
            {current.tagline}
          </p>
          <h3 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
            {current.discount}
          </h3>
        </div>

        {/* Image Section */}
        <div className="relative w-1/2 h-full overflow-hidden flex items-center justify-end">
          <img
            src={current.image}
            alt="Delicious Offer"
            className="w-full h-full object-cover object-center rounded-r-3xl"
            loading="lazy"
          />
          {/* Subtle blend gradient */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#E33B0B] to-transparent"></div>
        </div>
      </div>

      {/* Pagination dots matching Figma */}
      <div className="flex items-center justify-center space-x-1.5 mt-2.5">
        {[0, 1, 2, 3, 4].map((dotIndex) => {
          const isActive = dotIndex === currentIndex;
          return (
            <button
              key={dotIndex}
              type="button"
              onClick={() => setCurrentIndex(dotIndex % OFFERS.length)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-6 bg-fastor-orange'
                  : 'w-2 bg-[#E9D7CE] hover:bg-gray-300'
              }`}
              aria-label={`Go to slide ${dotIndex + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
