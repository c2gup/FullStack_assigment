import React, { useState } from 'react';
import {
  Code2,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import { fastorApi } from '../services/fastorApi';
import toast from 'react-hot-toast';

export const ExternalApiPage = () => {
  // Step 1: Register
  const [phone, setPhone] = useState('9818979450');
  const [dialCode, setDialCode] = useState('+91');
  const [regLoading, setRegLoading] = useState(false);
  const [regResponse, setRegResponse] = useState(null);

  // Step 2: Login with OTP
  const [otp, setOtp] = useState('123456');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginResponse, setLoginResponse] = useState(null);
  const [receivedToken, setReceivedToken] = useState('');

  // Step 3: Fetch Restaurants
  const [cityId, setCityId] = useState('118');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [restaurantsResponse, setRestaurantsResponse] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegResponse(null);
    try {
      const data = await fastorApi.registerUser({ phone, dial_code: dialCode });
      setRegResponse(data);
      toast.success('Step 1: OTP sent successfully from Fastor API');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setRegResponse({ error: msg });
      toast.error(`Step 1 failed: ${msg}`);
    } finally {
      setRegLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginResponse(null);
    try {
      const data = await fastorApi.loginWithOtp({ phone, otp, dial_code: dialCode });
      setLoginResponse(data);
      const token = data?.data?.token;
      if (token) {
        setReceivedToken(token);
        toast.success('Step 2: Token obtained from Fastor API!');
      } else {
        toast.error('Token not present in response');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setLoginResponse({ error: msg });
      toast.error(`Step 2 failed: ${msg}`);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleFetchRestaurants = async (e) => {
    e.preventDefault();
    if (!receivedToken) {
      toast.error('Please complete Step 2 (Login with OTP) first to obtain the JWT token');
      return;
    }
    setFetchLoading(true);
    setRestaurantsResponse(null);
    try {
      const data = await fastorApi.fetchRestaurants(receivedToken, cityId);
      setRestaurantsResponse(data);
      toast.success('Step 3: Restaurants loaded successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setRestaurantsResponse({ error: msg });
      toast.error(`Step 3 failed: ${msg}`);
    } finally {
      setFetchLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Title & Postman Collection Analysis */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Code2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Postman Collection Inspector & Integration
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Inspection results for Postman Collection ID: <span className="font-mono text-purple-700 font-semibold">8878133-877a3a64-7f42-4f37-bdbe-00c428296471</span>
              </p>
            </div>
          </div>

          <a
            href="https://www.postman.com/lunar-sunset-956052/react-task/collection/8878133-877a3a64-7f42-4f37-bdbe-00c428296471"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-purple-700 bg-slate-50 border border-slate-200 rounded-lg transition-colors"
          >
            <span>Original Collection</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Architectural Analysis Box */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Inspection Summary & Architectural Distinction:</span>
          </div>
          <p>
            1. <span className="font-semibold">Available Endpoints in Postman:</span> (a) <code className="bg-amber-100 px-1 rounded">POST /pwa/user/register</code> (Phone + Dial Code), (b) <code className="bg-amber-100 px-1 rounded">POST /pwa/user/login</code> (Phone + Default OTP: 123456), and (c) <code className="bg-amber-100 px-1 rounded">GET /m/restaurant?city_id=118</code> (Bearer Token).
          </p>
          <p>
            2. <span className="font-semibold">Scope Distinction:</span> The Postman collection contains external Fastor APIs. They do not support the CRM Lead Management System (which requires student enquiries, unassigned leads pool, counselor registration/login with email/password, atomic lead claims, and status progression).
          </p>
          <p>
            3. <span className="font-semibold">Separation of Concerns:</span> As specified in Section 2, the external Fastor integration is maintained in a completely separate client (<code className="bg-amber-100 px-1 rounded">fastorApi.js</code>) without polluting or exposing internal CRM secrets. You can test the live collection calls below.
          </p>
        </div>
      </div>

      {/* 3 Step Interactive Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Register */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                Step 1: Register
              </span>
              <span className="text-[11px] font-mono text-slate-400">POST /pwa/user/register</span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-2">Request OTP</h3>
            <p className="text-xs text-slate-500 mb-4">
              Sends an SMS OTP trigger to Fastor staging gateway.
            </p>

            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Dial Code
                </label>
                <input
                  type="text"
                  value={dialCode}
                  onChange={(e) => setDialCode(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border rounded-lg font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {regLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Send OTP Request</span>
              </button>
            </form>
          </div>

          {regResponse && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Response:</span>
              <pre className="text-[11px] bg-slate-900 text-emerald-400 p-2.5 rounded-lg overflow-x-auto max-h-32">
                {JSON.stringify(regResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Step 2: Login with OTP */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                Step 2: Login
              </span>
              <span className="text-[11px] font-mono text-slate-400">POST /pwa/user/login</span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-2">Verify OTP & Get JWT</h3>
            <p className="text-xs text-slate-500 mb-4">
              Uses default OTP: <code className="bg-slate-100 px-1 rounded">123456</code> to get Fastor JWT.
            </p>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border rounded-lg font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {loginLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>Verify OTP & Extract Token</span>
              </button>
            </form>
          </div>

          {loginResponse && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Token Received: {receivedToken ? '✅' : '❌'}
              </span>
              <pre className="text-[11px] bg-slate-900 text-emerald-400 p-2.5 rounded-lg overflow-x-auto max-h-32">
                {JSON.stringify(loginResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Step 3: Fetch Restaurants */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                Step 3: Fetch Data
              </span>
              <span className="text-[11px] font-mono text-slate-400">GET /m/restaurant</span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-2">Fetch Restaurants</h3>
            <p className="text-xs text-slate-500 mb-4">
              Passes <code className="bg-slate-100 px-1 rounded">Authorization: Bearer &lt;token&gt;</code>.
            </p>

            <form onSubmit={handleFetchRestaurants} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  City ID
                </label>
                <input
                  type="text"
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border rounded-lg font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={fetchLoading || !receivedToken}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-40"
              >
                {fetchLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Building2 className="w-3.5 h-3.5" />}
                <span>Fetch Restaurants</span>
              </button>
            </form>
          </div>

          {restaurantsResponse && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Results: {restaurantsResponse?.data?.results?.length || 0} Restaurants
              </span>
              <pre className="text-[11px] bg-slate-900 text-emerald-400 p-2.5 rounded-lg overflow-x-auto max-h-32">
                {JSON.stringify(restaurantsResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
