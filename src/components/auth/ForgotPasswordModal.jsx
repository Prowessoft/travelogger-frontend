import React, { useState } from "react";
import { X, Mail, Lock } from "lucide-react";
import { useAuthStore } from "../../store/authStore";


const ForgotPasswordModal = ({ isForgotPassModalOpen, onClose, onReset }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { updatePassword } = useAuthStore();

  if (!isForgotPassModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password validation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Reset password function (API call can be added here)
    handleResetPassword();
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");

    onClose(); // Close modal after successful submission
  };

  const handleResetPassword = async () => {
    try {
      const message = await updatePassword(email, newPassword, confirmPassword);
      console.log("Password Update Success:", message);
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Password Update Failed:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto p-6 shadow-xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Enter your email and set a new password.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-100 text-red-600 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* New Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter new password"
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
            onClick={() => handleResetPassword()}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
