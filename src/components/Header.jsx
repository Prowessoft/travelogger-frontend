import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Camera, Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { AuthModal } from "./auth/AuthModal";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";


export function Header() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { isAuthenticated, signOut, deleteAccount, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleDeleteProfile = async () => {
    try{
      toast.loading("Deleting profile...");
      await deleteAccount(user?.id || user?.userId);
      toast.dismiss();
      setIsDeleteModalOpen(false);
      toast.success("Profile deleted successfully");
      navigate("/");
    }
    catch (error) {
      toast.error("Error deleting profile. please try again later")
      console.log(error);
    }
  }

  const handleSignOut =  () => {
    const loadingToastId = toast.loading("Signing out...");
    try {
      setTimeout(() => {
        toast.dismiss(loadingToastId);
        signOut();
        toast.success("Signed out successfully!!");
        setIsOpen(false);
        navigate("/");
      }, 500);
    } catch (error) {
      toast.dismiss();
      console.log(error);
    }
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
                Travelogger
              </span>
            </Link>

            {/* Desktop Navigation */}
            {/* <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/experiences"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                <Camera className="w-4 h-4" />
                Experiences
              </Link>
            </nav> */}

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  {/* Profile Button (Avatar + Name + Chevron) */}
                  <button
                    className="flex items-center gap-2 focus:outline-none px-3 py-2 rounded-lg"
                    onMouseEnter={() => setIsOpen(true)} // Open on hover
                    onMouseLeave={() => setIsOpen(false)} // Close when mouse leaves dropdown
                  >
                    <img
                      src={user.avatarImgUrl}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                    <span className="font-medium text-gray-700">
                      {user.name}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>

                  {/* Dropdown Menu (Keep open until the user moves out of it) */}
                  <div
                    className={`absolute right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg transition-opacity ${
                      isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                    onMouseEnter={() => setIsOpen(true)} // Keep open when hovered
                    onMouseLeave={() => setIsOpen(false)} // Close when mouse leaves dropdown
                  >
                    <ul className="py-2 text-gray-700">
                      <li>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 hover:bg-gray-200"
                          onClick={() => setIsOpen(false)}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleSignOut}
                          className="flex w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            navigate("/");
                            setIsOpen(false);
                            setIsDeleteModalOpen(true)
                          }}
                          className="flex w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        >
                          Delete Profile
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
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
              {/* <Link
                to="/experiences"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Camera className="w-4 h-4" />
                Experiences
              </Link> */}
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
                <>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-gray-900 font-medium py-2 text-left"
                  >
                    Sign Out
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsDeleteModalOpen(true)
                    }}
                    className="flex w-full text-left py-2 hover:bg-gray-100 text-red-600"
                  >
                    Delete Profile
                  </button>
                </>
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
          setAuthMode(null);
        }}
        initialMode={authMode}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProfile}
      />
    </>
  );
}
