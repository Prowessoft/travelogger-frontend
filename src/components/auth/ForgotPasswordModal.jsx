import React, { useState, useEffect } from "react";
import { X, Mail, Lock, Clock, RefreshCw } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import authService from "../../services/authService";
import { toast } from "sonner";

const ForgotPasswordModal = ({ isForgotPassModalOpen, onClose, googleLoginEmail }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [forgotPasswordType, setForgotPasswordType] = useState("");
  const { updatePassword } = useAuthStore();

  useEffect(() => {
    let countdown;
    if (step === 2 && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [timer, step]);

  useEffect(() => {
    setEmail(googleLoginEmail);
  }, [googleLoginEmail]);

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password)) return "Must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Must contain at least one digit.";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) return "Must contain at least one special character.";
    return "";
  };

  const handleSendOtp = async (email, type) => {
    if (!email || !validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if(type === "resend") {
      setForgotPasswordType(type);
    }

    try {
      toast.loading("sending otp...");
      const response = await authService.sendOtp(email);
      toast.dismiss();
      toast.success("OTP sent successfully!!");
      if (response.statusCode !== 200) throw new Error("Failed to send OTP");
      setStep(2);
      setTimer(60);
      setIsResendDisabled(true);
      setTimeout(() => setIsResendDisabled(false), 60000);
      setError("");
    } catch (err) {
      toast.dismiss();
      setError(err.message);
    }
  };

  const handleVerifyOtp = async (email, otp) => {
    try {
      toast.loading("veryfying otp...");
      const response = await authService.verifyOtp(email, otp);
      toast.dismiss();
      toast.success("OTP verified successfully!!");
      if (!response.statusCode) throw new Error("Invalid OTP");
      setStep(3);
      setError("");
    } catch (err) {
      toast.dismiss();
      setError(err.message);
    }
  };

  const handleResetPassword = async (newPassword, confirmPassword) => {
    try {
      toast.loading("Updating password...");
      const message = await updatePassword(email, newPassword, confirmPassword);
      toast.dismiss();
      alert("Password updated successfully! Please login to continue.");
      handleCloseModal();
    } catch (err) {
      if(err.message === 'Invalid or expired OTP') {
        setError('Entered OTP is invalid or expired. Please use resend OTP and try again');
        return;
      }
      setError(err.message);
    }
  };

  const handleCloseModal = () => {
    onClose();
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setPasswordError("");
    setForgotPasswordType("");
    setTimer(60);
    setIsResendDisabled(true);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (!newEmail) {
      setError("");
      return;
    }

    if (!validateEmail(newEmail)) {
      setError("Enter a valid email address.");
    } else {
      setError("");
    }
  };

  const handleOtpChange = (e) => {
    const input = e.target.value;
    if (/^\d{0,6}$/.test(input)) {
      setOtp(input);
    }
  };

  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    setPasswordError(validatePassword(newPass));
    if(confirmPassword) {
      if(newPass !== confirmPassword) {
        setPasswordError("Passwords do not match.");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPass = e.target.value;
    setConfirmPassword(confirmPass);

    if (newPassword !== confirmPass) {
      setPasswordError("Passwords do not match.");
    } else {
      setPasswordError(validatePassword(newPassword));
    }
  };

  if (!isForgotPassModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
          </h2>
          <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 text-red-600 p-3 rounded-lg">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            {!googleLoginEmail ? (<div>
              <div className="font-medium text-gray-700 mb-4">Please enter valid email address, we will send you otp to reset password.</div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label> */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>): (
              <div className="font-medium text-gray-700 mb-4">Looks like you are already login with google to our system. Please click on send otp to setup a password and login to our system</div>
            )}
            <button
              onClick={() => handleSendOtp(email, "send")}
              disabled={!validateEmail(email) || !!error}
              className={`w-full py-2 rounded-lg transition text-white ${
                !validateEmail(email) || !!error
                  ? "bg-primary-300 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <p className="block font-medium text-gray-700 mb-4">A 6-digit code is sent to your email. Please enter the otp to {googleLoginEmail ? 'set' : 'reset'} password.</p>
              {forgotPasswordType === "resend" && <p className="block font-medium text-gray-700 mb-4">Otp is resent. Please enter the code.</p>}
              {/* <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label> */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter OTP"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {timer} sec
              </p>
              <button
                onClick={() => handleSendOtp(email, "resend")}
                disabled={isResendDisabled || !validateEmail(email)}
                className={`flex items-center text-primary-600 ${
                  isResendDisabled || !validateEmail(email)
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:underline"
                }`}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Resend OTP
              </button>
            </div>
            <button
              onClick={() => handleVerifyOtp(email, otp)}
              disabled={!/^\d{6}$/.test(otp)}
              className={`w-full py-2 rounded-lg transition text-white ${
                !/^\d{6}$/.test(otp)
                  ? "bg-primary-300 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              Verify OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="block font-medium text-gray-700 mb-4">OTP validation is success. Please create a new password.</p>
            <div>
              <label className="block text-left font-medium text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter new password"
                />
              </div>
            </div>
            <div>
              <label className="block text-left font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter new password"
                />
              </div>
            </div>
            {passwordError && (
              <div className="mt-2 text-left text-red-600 text-sm">{passwordError}</div>
            )}
            <button
              onClick={() => handleResetPassword(newPassword, confirmPassword)}
              disabled={
                !newPassword ||
                !confirmPassword ||
                !!passwordError ||
                newPassword !== confirmPassword
              }
              className={`w-full py-2 rounded-lg transition text-white ${
                !newPassword || !confirmPassword || !!passwordError || newPassword !== confirmPassword
                  ? "bg-primary-300 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
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
