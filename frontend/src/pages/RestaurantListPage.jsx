import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Search,
  Bell,
  Wallet,
  LogOut,
  RefreshCw,
  AlertCircle,
  X,
  User,
  SlidersHorizontal,
} from "lucide-react";
import { StatusBar } from "../components/common/StatusBar";
import { BestSellerCarousel } from "../components/restaurant/BestSellerCarousel";
import { OfferBanner } from "../components/restaurant/OfferBanner";
import { RestaurantCard } from "../components/restaurant/RestaurantCard";
import { RestaurantSkeletonList } from "../components/restaurant/RestaurantSkeleton";
import { Pagination } from "../components/restaurant/Pagination";
import { Toast } from "../components/common/Toast";
import { useAuth } from "../context/AuthContext";
import { getRestaurants } from "../services/restaurantService";
import { extractErrorMessage } from "../services/api";

export const RestaurantListPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ total_pages: 3, total_count: 56 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });

  // Display user name: In Figma it shows "Karan"
  const displayName =
    user?.user_name && user.user_name !== "Guest" ? user.user_name : "Karan";

  const fetchRestaurantsList = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRestaurants({ page });
      setRestaurants(data.results || []);
      if (data.meta) {
        setMeta(data.meta);
      }
    } catch (err) {
      console.error("Failed to load restaurants:", err);
      const errMsg = extractErrorMessage(
        err,
        "Failed to load restaurants. Please check your connection.",
      );
      setError(errMsg);
      setToast({ message: errMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurantsList(currentPage);
  }, [currentPage, fetchRestaurantsList]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    setToast({ message: "Logged out successfully", type: "info" });
    navigate("/register");
  };

  // Client-side search filtering
  const filteredRestaurants = restaurants.filter((r) => {
    if (!searchQuery.trim()) return true;
    const nameMatch = r.restaurant_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const addressMatch = r.address_complete
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return nameMatch || addressMatch;
  });

  return (
    <div className="flex flex-col  bg-white select-none pb-1">
      <StatusBar />

      {/* Main Content Area */}
      <div className="px-5 pt-1">
        {/* Header: Location matching Figma Screen 3 */}
        <div className="flex items-center justify-between mt-1">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 tracking-wide block uppercase">
              Current Locations
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-4 h-4 text-fastor-orange" />
              <span className="text-sm sm:text-base font-bold text-fastor-dark">
                Model Town, New Delhi
              </span>
            </div>
          </div>

          {/* Refresh button */}
          <button
            type="button"
            onClick={() => fetchRestaurantsList(currentPage)}
            disabled={loading}
            className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-fastor-orange hover:bg-orange-50 active:scale-95 transition"
            title="Refresh Restaurants"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-fastor-orange" : ""}`}
            />
          </button>
        </div>

        {/* User Greeting & Quick Action Buttons matching Figma Screen 3 */}
        <div className="flex items-center justify-between gap-3 mt-4">
          {/* User Name Pill / Profile Card */}
          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="flex-1 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-fastor-light border border-gray-100 hover:border-orange-200 transition text-left group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-fastor-orange font-bold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-base font-bold text-fastor-dark block group-hover:text-fastor-orange transition">
                  {displayName}
                </span>
                <span className="text-[10px] text-gray-400">
                  View profile & settings
                </span>
              </div>
            </div>
          </button>

          {/* Quick Action Button 1: Coral / Orange Notification button matching Figma */}
          <button
            type="button"
            onClick={() =>
              setToast({
                message: "No new notifications right now!",
                type: "info",
              })
            }
            className="w-11 h-11 rounded-2xl bg-[#FF6B4A] hover:bg-[#F25835] text-white flex items-center justify-center shadow-xs active:scale-95 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 fill-white/20" />
          </button>

          {/* Quick Action Button 2: Blue Wallet button matching Figma */}
          <button
            type="button"
            onClick={() =>
              setToast({
                message: "Fastor Wallet Balance: ₹2,450.00",
                type: "success",
              })
            }
            className="w-11 h-11 rounded-2xl bg-fastor-blue hover:bg-[#3F5EB0] text-white flex items-center justify-center shadow-xs active:scale-95 transition"
            aria-label="Wallet"
          >
            <Wallet className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants, cuisines, dishes..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-2.5 pl-10 pr-9 text-xs sm:text-sm font-medium text-fastor-dark placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-fastor-orange focus:ring-2 focus:ring-fastor-orange/15 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Best Seller Section matching Figma Screen 3 */}
        <div className="mt-4">
          <BestSellerCarousel />
        </div>

        {/* Promotional 30% OFF Banner matching Figma Screen 3 */}
        <OfferBanner />

        {/* Restaurant Listing / Popular Items Section */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-fastor-dark">
                Popular Items
              </h2>
              <p className="text-xs text-gray-400">
                Live verified restaurants near you
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              {meta.total_count} places
            </span>
          </div>

          {/* Loading Skeleton */}
          {loading && <RestaurantSkeletonList count={4} />}

          {/* Error State with Retry Button */}
          {!loading && error && (
            <div className="p-6 bg-black border border-red-200 rounded-3xl text-center my-4">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-red-800">
                Failed to load restaurants
              </h4>
              <p className="text-xs text-red-600 mt-1 max-w-xs mx-auto">
                {error}
              </p>
              <button
                type="button"
                onClick={() => fetchRestaurantsList(currentPage)}
                className="mt-4 px-4 py-2 bg-fastor-orange text-white text-xs font-bold rounded-xl shadow-button hover:bg-fastor-orange-hover active:scale-95 transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty Search State */}
          {!loading && !error && filteredRestaurants.length === 0 && (
            <div className="py-12 px-4 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-800">
                No restaurants found
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                We couldn't find any restaurants matching "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-3 text-xs font-bold text-fastor-orange underline"
              >
                Clear search filter
              </button>
            </div>
          )}

          {/* List of Restaurant Cards */}
          {!loading && !error && filteredRestaurants.length > 0 && (
            <div>
              {filteredRestaurants.map((restaurant, idx) => (
                <RestaurantCard
                  key={restaurant.restaurant_id || idx}
                  restaurant={restaurant}
                  index={idx}
                />
              ))}

              {/* Server-supported Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={meta.total_pages || 3}
                totalCount={meta.total_count || 56}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* User Profile / Logout Drawer Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-float border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-fastor-dark">
                Account Profile
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-fastor-orange mx-auto flex items-center justify-center text-fastor-orange font-bold text-2xl mb-2">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-base font-bold text-fastor-dark">
                {displayName}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {user?.user_mobile || "+91 9818979450"}
              </p>
              <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                Active Session
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 transition font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>

              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="w-full py-3 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
    </div>
  );
};
