import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  AlertCircle,
  Mail,
  Lock,
  User,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const avatars = [
  "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Luna&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Max&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Zoe&backgroundColor=ffd5dc",
];

const defaultAvatar =
  "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Default&backgroundColor=b6e3f4";

export function AuthModal({ isOpen, onClose, initialMode = "signin" }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatar);
  const [serverError, setServerError] = useState(false);
  const { signIn, signUp, loading, error, clearError } = useAuthStore();

  useEffect(() => {
    if (!isOpen) return;
    clearError();
    setEmail("");
    setPassword("");
    setName("");
    setSelectedAvatar(defaultAvatar);
    setServerError(false);
  }, [isOpen, clearError]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (mode === "signup") {
      setEmail("");
      setPassword("");
    }
  }, [mode]);
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(false);

    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password, name, selectedAvatar);
      }
      onClose();
    } catch (error) {
      // Check if it's a server connection error
      if (error.message.includes("Unable to connect to the server")) {
        setServerError(true);
      }
      // Error is already handled by the store
      console.log("Authentication failed:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl mx-auto overflow-hidden flex shadow-xl">
        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src={
              mode === "signin"
                ? "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80"
                : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80"
            }
            alt="Travel"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                {mode === "signin" ? "Welcome Back!" : "Join Our Community"}
              </h2>
              <p className="text-white/90 text-lg">
                {mode === "signin"
                  ? "Sign in to continue your journey with us"
                  : "Create an account to start planning your next adventure"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {serverError && (
            <div className="mb-6 bg-yellow-50 text-yellow-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Server Connection Error</h3>
              <p className="text-sm">
                Unable to connect to the server. Please:
              </p>
              <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                <li>Check if the server is running</li>
                <li>Verify your internet connection</li>
                <li>Try again in a few moments</li>
              </ul>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            autoComplete={mode === "signin" ? "on" : "off"}
          >
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your email"
                      autoComplete={mode === "signin" ? "on" : "new-email"}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder={
                        mode === "signin"
                          ? "Enter your password"
                          : "Create a password"
                      }
                      autoComplete={mode === "signin" ? "on" : "new-password"}
                      required
                    />
                  </div>
                </div>
              </>
            )}
            {mode === "signin" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your email"
                      autoComplete={mode === "signin" ? "on" : "new-email"}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder={
                        mode === "signin"
                          ? "Enter your password"
                          : "Create a password"
                      }
                      autoComplete={mode === "signin" ? "on" : "new-password"}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose an Avatar
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {avatars.map((avatarUrl, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedAvatar(avatarUrl)}
                      className={`relative rounded-xl overflow-hidden aspect-square group transition-transform hover:scale-105 ${
                        selectedAvatar === avatarUrl
                          ? "ring-2 ring-primary-500 ring-offset-2"
                          : ""
                      }`}
                    >
                      <img
                        src={avatarUrl}
                        alt={`Avatar ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute inset-0 transition-opacity duration-200 ${
                          selectedAvatar === avatarUrl
                            ? "bg-primary-500/20"
                            : "bg-black/0 group-hover:bg-black/10"
                        }`}
                      >
                        {selectedAvatar === avatarUrl && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {mode === "signin" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  clearError();
                }}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {mode === "signin"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
