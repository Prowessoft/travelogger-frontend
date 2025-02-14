import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Camera, Menu, X, User } from "lucide-react";
import { AuthModal } from "./auth/AuthModal";
import { useAuthStore } from "../store/authStore";

export function Header() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, signOut, user } = useAuthStore();
  const navigate = useNavigate();

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Compass className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">
                Wanderlust
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/experiences"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                <Camera className="w-4 h-4" />
                Experiences
              </Link>
              {/* {isAuthenticated && (
                
              )} */}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-gray-900 gap-1 flex"
                  >
                    {/* <User className="w-5 h-5" /> */}
                    <img
                      src={user.avatarImgUrl}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full ml-auto border-2 border-white"
                    />

                    <span className="mt-1 font-medium">{user.name}</span>
                    {/* Profile */}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick("signin")}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick("signup")}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 shadow-lg">
            <nav className="flex flex-col gap-4">
              <Link
                to="/experiences"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Camera className="w-4 h-4" />
                Experiences
              </Link>
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-gray-900 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-gray-900 font-medium py-2 text-left"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick("signin")}
                    className="text-gray-600 hover:text-gray-900 font-medium py-2 text-left"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick("signup")}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setAuthMode(null)
        }}
        initialMode={authMode}
      />
    </>
  );
}