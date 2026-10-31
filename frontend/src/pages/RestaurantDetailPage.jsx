import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Star, MapPin, Check } from 'lucide-react';
import { StatusBar } from '../components/common/StatusBar';
import { Toast } from '../components/common/Toast';
import { getRestaurantById } from '../services/restaurantService';

const PORTION_OPTIONS = [
  { id: 'personal', name: 'Personal (4 Slides)', price: 0.0, priceLabel: '$0.00' },
  { id: 'medium', name: 'Medium (8 Slides)', price: 3.0, priceLabel: '$3.00' },
  { id: 'familiar', name: 'Familiar (10 Slides)', price: 6.0, priceLabel: '$6.00' },
  { id: 'jumbo', name: 'Jumbo (12 Slides)', price: 10.0, priceLabel: '$10.00' },
];

export const RestaurantDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(location.state?.restaurant || null);
  const [loading, setLoading] = useState(!restaurant);
  const [quantity, setQuantity] = useState(3); // Matching Figma Screen 4 quantity '3'
  const [selectedPortion, setSelectedPortion] = useState('jumbo'); // Matching Figma Screen 4 selected 'Jumbo'
  const [basePrice, setBasePrice] = useState(14.0); // Matching Figma Screen 4 '₹14.00'
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    if (!restaurant && id) {
      const fetchDetail = async () => {
        try {
          setLoading(true);
          const data = await getRestaurantById(id);
          setRestaurant(data);
        } catch (err) {
          console.warn('Could not load specific restaurant details:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [id, restaurant]);

  const handleQuantityMinus = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityPlus = () => {
    setQuantity((prev) => prev + 1);
  };

  const currentPortion = PORTION_OPTIONS.find((p) => p.id === selectedPortion) || PORTION_OPTIONS[3];
  const totalPrice = ((basePrice + currentPortion.price) * quantity).toFixed(2);

  const heroImage =
    restaurant?.logo && restaurant.logo.startsWith('http')
      ? restaurant.logo
      : 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';

  const restaurantName = restaurant?.restaurant_name || 'Lorem ipsum dolor sit amet';

  const handleAddToCart = () => {
    setToast({
      message: `Added ${quantity}x ${restaurantName} (${currentPortion.name}) to cart!`,
      type: 'success',
    });
  };

  return (
    <div className="flex flex-col flex-1 bg-white select-none pb-8 min-h-screen">
      <StatusBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between px-5 pt-1">
        <div>
          {/* Top Back Navigation Button */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => navigate('/restaurants')}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-fastor-orange hover:bg-orange-50 active:scale-95 transition"
              aria-label="Back to restaurants"
            >
              <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Item Details
            </span>
            <div className="w-8"></div>
          </div>

          {/* Hero Image Card matching Figma Screen 4 */}
          <div className="relative w-full h-56 sm:h-64 rounded-3xl overflow-hidden bg-gray-100 shadow-md">
            <img
              src={heroImage}
              alt={restaurantName}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {/* Rating badge */}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.8</span>
            </div>
          </div>

          {/* Price & Quantity Stepper matching Figma Screen 4 */}
          <div className="flex items-center justify-between mt-5 pb-2">
            <span className="text-2xl font-black text-fastor-orange tracking-tight">
              ₹{basePrice.toFixed(2)}
            </span>

            {/* Stepper matching Figma: [- 3 +] in orange */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleQuantityMinus}
                className="w-7 h-7 rounded-full bg-fastor-orange text-white flex items-center justify-center shadow-xs active:scale-90 transition hover:bg-fastor-orange-hover"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>

              <span className="text-lg font-bold text-fastor-dark min-w-[20px] text-center">
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleQuantityPlus}
                className="w-7 h-7 rounded-full bg-fastor-orange text-white flex items-center justify-center shadow-xs active:scale-90 transition hover:bg-fastor-orange-hover"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Dish Title & Description matching Figma Screen 4 */}
          <div className="mt-2">
            <h1 className="text-lg sm:text-xl font-bold text-fastor-dark leading-snug">
              {restaurantName}
            </h1>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-normal">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore.
            </p>
          </div>

          {/* Personal Portion Section matching Figma Screen 4 */}
          <div className="mt-6">
            <h2 className="text-base font-bold text-fastor-dark mb-3">Personal portion</h2>

            <div className="space-y-3.5">
              {PORTION_OPTIONS.map((option) => {
                const isSelected = selectedPortion === option.id;
                return (
                  <label
                    key={option.id}
                    onClick={() => setSelectedPortion(option.id)}
                    className="flex items-center justify-between cursor-pointer group py-0.5"
                  >
                    <span
                      className={`text-xs sm:text-sm transition ${
                        isSelected ? 'font-semibold text-fastor-dark' : 'text-gray-600'
                      }`}
                    >
                      {option.name}
                    </span>

                    {/* Dotted line leader */}
                    <div className="flex-1 mx-2 border-b border-dotted border-gray-300"></div>

                    <div className="flex items-center space-x-3">
                      <span className="text-xs sm:text-sm font-medium text-gray-600">
                        {option.priceLabel}
                      </span>

                      {/* Custom Figma-styled radio button */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-fastor-orange bg-white'
                            : 'border-gray-300 group-hover:border-gray-400 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-fastor-orange"></div>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Add to Cart Button matching Figma Screen 4 */}
        <div className="mt-8 pt-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-4 rounded-2xl bg-fastor-orange text-white text-base font-bold tracking-wide shadow-button hover:bg-fastor-orange-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>Add to cart</span>
            <span className="text-white/80 font-normal text-sm">• ₹{totalPrice}</span>
          </button>

          {/* iOS Bottom Home Bar */}
          <div className="w-32 h-1 bg-gray-800 rounded-full mx-auto mt-4 opacity-70"></div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
};
