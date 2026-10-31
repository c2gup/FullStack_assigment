import React from 'react';
import { useNavigate } from 'react-router-dom';

const BEST_SELLERS = [
  {
    id: 'bs-1',
    name: 'Dragon Roll Sushi',
    price: '$103.0',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80',
    restaurantId: '75',
  },
  {
    id: 'bs-2',
    name: 'Butter Chicken Rice',
    price: '$50.0',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=400&q=80',
    restaurantId: '74',
  },
  {
    id: 'bs-3',
    name: 'Cheesy Lasagna',
    price: '$12.99',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80',
    restaurantId: '68',
  },
  {
    id: 'bs-4',
    name: 'Berry Cream Cupcake',
    price: '$8.20',
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=400&q=80',
    restaurantId: '67',
  },
  {
    id: 'bs-5',
    name: 'Gourmet Burger',
    price: '$18.50',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    restaurantId: '66',
  },
];

export const BestSellerCarousel = () => {
  const navigate = useNavigate();

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-lg font-bold text-fastor-dark">Best Seller</h2>
        <span className="text-xs font-semibold text-fastor-orange cursor-pointer hover:underline">
          View all
        </span>
      </div>

      <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1 px-1 -mx-1">
        {BEST_SELLERS.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/restaurant/${item.restaurantId}`, { state: { item } })}
            className="flex-shrink-0 w-20 sm:w-24 group cursor-pointer"
          >
            <div className="relative h-28 sm:h-32 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 transition-all duration-200 group-hover:shadow-md group-hover:scale-[1.02]">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {/* Bottom orange price badge matching Figma */}
              <div className="absolute bottom-1 right-1 bg-fastor-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                {item.price}
              </div>
            </div>
            <p className="text-[11px] font-medium text-gray-700 mt-1.5 truncate text-center">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
