import { useState, useEffect } from "react";
import { X } from "lucide-react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) setShow(true);
    else {
      const timeout = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transition-transform duration-200 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Delete Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="text-gray-700 text-base mb-6">
          Are you sure you want to delete the profile? This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="w-24 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="w-24 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
