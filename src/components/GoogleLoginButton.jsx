import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axiosInstance from '../utils/axiosConfig';
import ForgotPasswordModal from "./auth/ForgotPasswordModal";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";




const GoogleLoginButton = ({onClose}) => {
  // const handleSuccess = (response) => {
  //   const idToken = response.credential; // This is the Google ID token

  //   console.log("Google ID Token:", idToken); // This is the token to send to the backend

  //   // Send the token to your Java backend
  //   fetch("http://localhost:8080/api/auth/google", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ token: idToken }), // Send token in request
  //   })
  //     .then((res) => res.json())
  //     .then((data) => console.log("Server Response:", data))
  //     .catch((error) => console.error("Error:", error));
  // };
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false); // New State
  const [googleEmail, setGoogleEmail] = useState(null);
  const { googleSignIn } = useAuthStore();



  const handleSuccess = async (response) => {
    const idToken = response.credential; // This is the Google ID token
  
    console.log("Google ID Token:", idToken); // This is the token to send to the backend
  
    try {
      
      const backendResponse = await axiosInstance.post("/google", 
        { idToken: idToken }, // Sending token as JSON
        { headers: { "Content-Type": "application/json" } } // Axios handles JSON conversion
      );

      googleSignIn(backendResponse.data);
      onClose();

      console.log("Server Response:", backendResponse.data);
    } catch (error) {
      console.error("Error:", error);
      if (error.status === 400) {
        const msg = error.data.message;
        setGoogleEmail(msg.substring(msg.indexOf("'") + 1, msg.lastIndexOf("'")));
        setIsForgotPasswordOpen(true);
      }
      return error;
    }
  };
  const handleFailure = (error) => {
    console.error("Google Sign-In Failed:", error);
  };

  return (
    <>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_LOGIN_API_KEY}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </GoogleOAuthProvider>
    <ForgotPasswordModal
      isForgotPassModalOpen={isForgotPasswordOpen}
      onClose={() => setIsForgotPasswordOpen(false)}
      googleLoginEmail= {googleEmail}
    />
    </>
    
  );
};

export default GoogleLoginButton;
