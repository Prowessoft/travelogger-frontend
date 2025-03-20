import React, { useState, useEffect } from "react";
import { X, Mail, Lock, Clock, RefreshCw } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import authService from '../../services/authService';

const ForgotPasswordModal = ({ isForgotPassModalOpen, onClose, onReset }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  // const [confirmPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: Reset Password
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const { updatePassword } = useAuthStore();

  useEffect(() => {
    let countdown;
    if (step === 2 && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [timer, step]);

  // Step 1: Send OTP API Call
  const handleSendOtp = async (email) => {
    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    
    try {
      const response = await authService.sendOtp(email);
      if (!response.statusCode == 200) throw new Error("Failed to send OTP");
      setStep(2); // Move to OTP verification step
      setTimer(60); // Reset timer
      setIsResendDisabled(true);
      setTimeout(() => setIsResendDisabled(false), 60000);
    } catch (error) {
      setError(error.message);
    }
  };

  // Step 2: Verify OTP API Call
  const handleVerifyOtp = async (email, otp) => {
    if (!email) return;
    try {
      const response = await authService.verifyOtp(email, otp);;
      if (!response.statusCode) throw new Error("Invalid OTP");
      setStep(3); // Move to Reset Password step
    } catch (error) {
      setError(error.message);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password)) return "Must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Must contain at least one digit.";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) return "Must contain at least one special character.";
    return "";
  };
  
  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    setPasswordError(validatePassword(newPass)); // Validate as user types
  };
  
  const handleConfirmPasswordChange = (e) => {
    const confirmPass = e.target.value;
    setConfirmPassword(confirmPass);
    if (newPassword !== confirmPass) {
      setPasswordError("Passwords do not match.");
    } else {
      setPasswordError("");
    }
  };

  // Step 3: Reset Password API Call
  const handleResetPassword = async (newPassword, confirmPassword) => {
    try {
      const message = await updatePassword(email, newPassword, confirmPassword);
      alert("Password updated successfully!, Please login to continue");
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  if (!isForgotPassModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto p-6 shadow-xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-100 text-red-600 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <button
              onClick={() => handleSendOtp(email)}
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Send OTP
            </button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter OTP"
                  required
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {timer} sec
              </p>
              <button
                onClick={() => handleSendOtp(email)}
                disabled={isResendDisabled}
                className={`flex items-center text-primary-600 ${isResendDisabled ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Resend OTP
              </button>
            </div>
            <button
              onClick={() => handleVerifyOtp(email, otp)}
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Verify OTP
            </button>
          </div>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>
            {passwordError && (
  <div className="mt-2 text-red-600 text-sm">{passwordError}</div>
)}
            <button
              onClick={() => handleResetPassword(newPassword, confirmPassword)}
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
