import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import { StatusBar } from '../components/common/StatusBar';
import { NumericKeypad } from '../components/common/NumericKeypad';
import { Toast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/authService';
import { extractErrorMessage } from '../services/api';

export const OtpPage = () => {
  const navigate = useNavigate();
  const { pendingPhone, login } = useAuth();

  const phone = pendingPhone?.phone || '9818979450';
  const dialCode = pendingPhone?.dialCode || '+91';

  // 6 individual boxes
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeBoxIndex, setActiveBoxIndex] = useState(0);
  const inputRefs = useRef([]);

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // 30s countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Focus current active input box
  useEffect(() => {
    inputRefs.current[activeBoxIndex]?.focus();
  }, [activeBoxIndex]);

  const handleBoxChange = (index, value) => {
    // Only accept numbers
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    // If pasted multiple digits
    if (cleanVal.length > 1) {
      const pastedDigits = cleanVal.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedDigits.forEach((d, idx) => {
        newOtp[idx] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(pastedDigits.length, 5);
      setActiveBoxIndex(nextIdx);
      setErrorMsg('');
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);
    setErrorMsg('');

    // Advance to next box if available
    if (index < 5) {
      setActiveBoxIndex(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        setActiveBoxIndex(index - 1);
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveBoxIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      setActiveBoxIndex(index + 1);
    }
  };

  const handleKeypadPress = (num) => {
    const emptyIndex = otp.findIndex((v) => v === '');
    const targetIndex = emptyIndex !== -1 ? emptyIndex : 5;

    const newOtp = [...otp];
    newOtp[targetIndex] = num;
    setOtp(newOtp);
    setErrorMsg('');

    if (targetIndex < 5) {
      setActiveBoxIndex(targetIndex + 1);
    }
  };

  const handleKeypadDelete = () => {
    // Find last filled index
    let lastFilledIndex = -1;
    for (let i = 5; i >= 0; i--) {
      if (otp[i] !== '') {
        lastFilledIndex = i;
        break;
      }
    }

    if (lastFilledIndex !== -1) {
      const newOtp = [...otp];
      newOtp[lastFilledIndex] = '';
      setOtp(newOtp);
      setActiveBoxIndex(lastFilledIndex);
      setErrorMsg('');
    }
  };

  const fullOtp = otp.join('');

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();

    if (fullOtp.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP');
      setToast({ message: 'Please enter all 6 digits of the OTP', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const response = await loginUser(phone, dialCode, fullOtp);

      if (response && response.status === 'Success' && response.data?.token) {
        // Save user and JWT token in AuthContext
        login(response.data, response.data.token);

        setToast({ message: 'Login successful! Redirecting...', type: 'success' });

        setTimeout(() => {
          navigate('/restaurants', { replace: true });
        }, 500);
      } else {
        throw new Error(response.data?.error_message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errMsg = extractErrorMessage(err, 'Invalid OTP or credentials. Please try again.');
      setErrorMsg(errMsg);
      setToast({ message: errMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;

    try {
      setResending(true);
      await registerUser(phone, dialCode);
      setTimer(30);
      setCanResend(false);
      setToast({ message: 'New OTP has been sent!', type: 'success' });
    } catch (err) {
      const errMsg = extractErrorMessage(err, 'Failed to resend OTP');
      setToast({ message: errMsg, type: 'error' });
    } finally {
      setResending(false);
    }
  };

  const fillTestOtp = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    setActiveBoxIndex(5);
    setErrorMsg('');
  };

  return (
    <div className="flex flex-col flex-1 bg-white select-none">
      <StatusBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between px-6 pt-2 pb-1">
        <div>
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-fastor-orange hover:bg-orange-50 active:scale-95 transition"
            aria-label="Back to register"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Title & Subtitle */}
          <div className="mt-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-fastor-dark tracking-tight">
              6-digit code
            </h1>
            <p className="text-sm text-gray-500 mt-2 font-normal leading-relaxed">
              Please enter the code we've sent to{' '}
              <span className="font-bold text-fastor-dark">
                {dialCode} {phone}
              </span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerifyOtp} className="mt-6">
            {/* 6 OTP Boxes with dash in center matching Figma Screen 2 */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5">
              {/* First 3 boxes */}
              <div className="flex gap-2">
                {[0, 1, 2].map((idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[idx]}
                    onChange={(e) => handleBoxChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onClick={() => setActiveBoxIndex(idx)}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border transition-all ${
                      otp[idx]
                        ? 'border-fastor-dark bg-white text-fastor-dark'
                        : activeBoxIndex === idx
                        ? 'border-fastor-orange ring-2 ring-fastor-orange/20 bg-white'
                        : 'border-gray-200 bg-gray-50 text-gray-800'
                    }`}
                  />
                ))}
              </div>

              {/* Center Dash matching Figma */}
              <span className="text-gray-400 font-bold px-0.5">-</span>

              {/* Next 3 boxes */}
              <div className="flex gap-2">
                {[3, 4, 5].map((idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[idx]}
                    onChange={(e) => handleBoxChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onClick={() => setActiveBoxIndex(idx)}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border transition-all ${
                      otp[idx]
                        ? 'border-fastor-dark bg-white text-fastor-dark'
                        : activeBoxIndex === idx
                        ? 'border-fastor-orange ring-2 ring-fastor-orange/20 bg-white'
                        : 'border-gray-200 bg-gray-50 text-gray-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-medium text-center mt-3 animate-fadeIn">
                {errorMsg}
              </p>
            )}

            {/* Resend Code Section matching Figma Screen 2 */}
            <div className="mt-5 text-center text-xs text-gray-500">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="font-bold text-fastor-orange hover:underline focus:outline-none"
                >
                  {resending ? 'Sending...' : 'Resend Code'}
                </button>
              ) : (
                <span>
                  I didn't receive a code{' '}
                  <span className="font-bold text-fastor-orange">
                    (00:{timer < 10 ? `0${timer}` : timer})
                  </span>
                </span>
              )}
            </div>

            {/* Staging Test OTP badge */}
            <div className="mt-4 p-2 bg-orange-50/80 rounded-xl border border-orange-100 flex items-center justify-between text-xs text-amber-900">
              <span className="font-medium">
                Staging Test OTP: <strong>123456</strong>
              </span>
              <button
                type="button"
                onClick={fillTestOtp}
                className="px-2.5 py-1 bg-white text-fastor-orange border border-orange-200 rounded-lg font-bold shadow-2xs hover:bg-orange-50 active:scale-95 transition"
              >
                Auto-fill
              </button>
            </div>

            {/* Continue Button matching Figma Screen 2 */}
            <button
              type="submit"
              disabled={loading || fullOtp.length !== 6}
              className="w-full mt-6 py-4 rounded-2xl bg-fastor-orange text-white text-base font-bold tracking-wide shadow-button hover:bg-fastor-orange-hover active:scale-[0.99] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span>Verifying...</span>
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>
        </div>

        {/* Numeric Keypad at bottom */}
        <div className="mt-2">
          <NumericKeypad onKeyPress={handleKeypadPress} onDelete={handleKeypadDelete} />
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
