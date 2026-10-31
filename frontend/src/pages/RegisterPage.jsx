import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Phone } from "lucide-react";
import { StatusBar } from "../components/common/StatusBar";
import { NumericKeypad } from "../components/common/NumericKeypad";
import { Toast } from "../components/common/Toast";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authService";
import { extractErrorMessage } from "../services/api";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { savePendingPhone } = useAuth();

  const [dialCode, setDialCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("9818979450"); // Pre-filled with staging test number
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [errorMsg, setErrorMsg] = useState("");

  const handleKeyPress = (num) => {
    if (phoneNumber.length < 10) {
      setPhoneNumber((prev) => prev + num);
      setErrorMsg("");
    }
  };

  const handleDelete = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
    setErrorMsg("");
  };

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(val);
    setErrorMsg("");
  };

  const handleGetOtp = async (e) => {
    if (e) e.preventDefault();

    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      setToast({
        message: "Please enter a valid 10-digit mobile number",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const response = await registerUser(phoneNumber, dialCode);

      // Save pending phone to context for OTP verification screen
      savePendingPhone({ phone: phoneNumber, dialCode });

      setToast({
        message: response.data || "OTP sent successfully!",
        type: "success",
      });

      // Navigate to OTP verification screen
      setTimeout(() => {
        navigate("/verify-otp");
      }, 400);
    } catch (err) {
      console.error("Registration failed:", err);
      const errMsg = extractErrorMessage(
        err,
        "Failed to send OTP. Please check mobile number.",
      );
      setErrorMsg(errMsg);
      setToast({
        message: errMsg,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-white select-none">
      <StatusBar />

      {/* Main Content Container */}
      <div className=" flex flex-col justify-between px-6 pt-2 pb-1">
        {/* Top Header & Back Button */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) navigate(-1);
            }}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-fastor-orange hover:bg-orange-50 active:scale-95 transition"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Title & Description matching Figma */}
          <div className="mt-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-fastor-dark tracking-tight">
              Sign Up to Fastor
            </h1>
            <p className="text-sm text-gray-500 mt-2 font-normal leading-relaxed">
              Let us know your mobile number and we will send you an OTP for
              verification.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleGetOtp} className="mt-8">
            {/* Input Box matching Figma Screen 1 */}
            <div
              className={`flex items-center px-4 py-3 rounded-2xl border transition-all ${
                errorMsg
                  ? "border-red-400 bg-red-50/20"
                  : "border-gray-200 bg-gray-50/70 focus-within:border-fastor-orange focus-within:bg-white focus-within:ring-2 focus-within:ring-fastor-orange/15"
              }`}
            >
              {/* Dial code */}
              <div className="flex items-center space-x-1 pr-3">
                <span className="text-base font-bold text-fastor-dark">
                  {dialCode}
                </span>
              </div>

              {/* Divider */}
              <div className="w-[1.5px] h-6 bg-fastor-orange/80 mr-3"></div>

              {/* Mobile number input */}
              <input
                type="tel"
                value={phoneNumber}
                onChange={handleInputChange}
                placeholder="- 00000"
                maxLength={10}
                className="w-full bg-transparent text-base font-semibold text-fastor-dark placeholder:text-gray-400 focus:outline-none tracking-wider"
              />

              {phoneNumber && (
                <button
                  type="button"
                  onClick={() => setPhoneNumber("")}
                  className="text-xs text-gray-400 hover:text-gray-600 px-1"
                >
                  Clear
                </button>
              )}
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-medium mt-2 pl-1 animate-fadeIn">
                {errorMsg}
              </p>
            )}

            {/* Test hint helper */}
            <div className="mt-3 p-2.5 bg-orange-50/80 rounded-xl border border-orange-100 flex items-center justify-between text-xs text-amber-900">
              <span className="font-medium">
                Staging Test Mobile: <strong>9818979450</strong>
              </span>
              <button
                type="button"
                onClick={() => setPhoneNumber("9818979450")}
                className="text-[11px] font-bold text-fastor-orange underline ml-2"
              >
                Use
              </button>
            </div>

            {/* Primary "Get OTP" Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 rounded-2xl bg-fastor-orange text-white text-base font-bold tracking-wide shadow-button hover:bg-fastor-orange-hover active:scale-[0.99] transition-all flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                "Get OTP"
              )}
            </button>

            {/* Terms and conditions subtext matching Figma */}
            <p className="text-[11px] text-gray-400 text-center mt-3 leading-tight">
              By clicking, I accept the{" "}
              <span className="font-semibold text-gray-600 cursor-pointer hover:underline">
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span className="font-semibold text-gray-600 cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </p>
          </form>
        </div>

        {/* Numeric Keypad at bottom matching Figma */}
        <div className="mt-1">
          <NumericKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
    </div>
  );
};
