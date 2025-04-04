import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";



const ShareViaEmailModal = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [show, setShow] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (isOpen) setShow(true);
    else {
      const timeout = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!email) setError("");
    else if (!validateEmail(email)) setError("Invalid email format.");
    else setError("");
  }, [email]);

  const handleSubmit = async () => {
    if (!validateEmail(email)) return;
    setSubmitting(true);
    try {
      await onSubmit(email);
      toast.dismiss();
      onClose();
      setEmail("");
    } catch (err) {
      setError("Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl transition-transform duration-200 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Share Itinerary</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X className="w-5 h-5 text-gray-500" />
            </button>
        </div>
        <label className="block text-sm font-medium text-gray-700 mt-2 mb-4">Enter email address to share the itinerary</label>
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-3 border rounded-lg text-base mb-2 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-end space-x-3 mt-5">
          <button
            onClick={onClose}
            className="w-32 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!!error || submitting || !email}
            // className={`flex items-center text-primary-600 font-medium ${
            //   !error && email ? "hover:underline" : "opacity-50 cursor-not-allowed"
            // }`}
            className={`w-32 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition  ${submitting ? "cursor-not-allowed" : ""}`}
          >
            Send
            {/* {submitting ? "Sending..." : "Send"} */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareViaEmailModal;
