"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Shield, ArrowRight, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import SEO from "@/src/components/SEO";

const OTPPage = () => {
  const [isDark, setIsDark] = useState(false); // White mode by default
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const router = useRouter();
  const [pendingSignup, setPendingSignup] = useState({});
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const stored = localStorage.getItem("pendingSignup");
    if (stored) setPendingSignup(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || !email) return toast.error("Missing email or OTP");
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return toast.error("Please enter complete OTP");

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/verify-otp", {
        ...pendingSignup,
        code: otpValue,
      });

      if (response.status === 200) {
        toast.success("Email verified successfully!");
        dispatch(setUser(response.data.data));
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP or email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <>
      <SEO
        title="Verify OTP"
        description="Verify your OTP for Shyam RO account registration."
        noindex={true}
      />
      <div className={`min-h-screen pt-16 transition-all duration-500 relative overflow-hidden ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
      {/* Static Grid Background */}
      <div className={`absolute inset-0 ${isDark ? 'opacity-20' : 'opacity-10'} transition-opacity`}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(${isDark ? '#374151' : '#e5e7eb'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDark ? '#374151' : '#e5e7eb'} 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full blur-xl animate-pulse ${
              isDark ? 'bg-blue-500' : 'bg-purple-400'
            }`}
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: 0.1,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + i * 2}s`
            }}
          />
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-40">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100'
          }`}
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className={`w-full max-w-md p-8 rounded-3xl backdrop-blur-xl shadow-2xl border transition-all duration-500 ${
          isDark ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'
        }`}>
          {/* Header */}
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${
              isDark ? 'bg-blue-600' : 'bg-purple-600'
            } animate-pulse`}>
              <Shield className="text-white w-8 h-8" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Verify Your Account
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Enter the 6-digit code sent to your device
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="my-8">
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-300 hover:scale-105 focus:scale-105 focus:outline-none ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400'
                      : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-purple-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex justify-center items-center gap-2 ${
              isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
            <ArrowRight size={20} />
          </button>

          {/* Footer */}
          <div className={`text-center mt-8 border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              className={`inline-flex items-center gap-2 font-medium transition-all duration-300 hover:scale-105 ${
                isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-purple-600 hover:bg-gray-100'
              } px-4 py-2 rounded-lg`}
            >
              <RotateCcw size={16} />
              Resend Code
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

OTPPage.requireAuth = false;
export default OTPPage;
