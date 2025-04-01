import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axiosInstance from '../utils/axiosConfig';

const GoogleLoginButton = () => {
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

  const handleSuccess = async (response) => {
    const idToken = response.credential; // This is the Google ID token
  
    console.log("Google ID Token:", idToken); // This is the token to send to the backend
  
    try {
      
      const backendResponse = await axiosInstance.post("/google", 
        { idToken: idToken }, // Sending token as JSON
        { headers: { "Content-Type": "application/json" } } // Axios handles JSON conversion
      );
  
      console.log("Server Response:", backendResponse.data);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };
  const handleFailure = (error) => {
    console.error("Google Sign-In Failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId="669615181991-fjjg47d9r1rt8bjkfctjkgqkc3et6k5m.apps.googleusercontent.com">
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
