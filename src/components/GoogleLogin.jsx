import { useEffect, useState } from "react";

const GoogleLogin = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    /* Initialize Google Sign-in */
    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID",
      callback: handleCredentialResponse,
    });

    /* Render Google Sign-in button */
    window.google.accounts.id.renderButton(
      document.getElementById("google-login-button"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = (response) => {
    // Decode JWT token (Google ID Token)
    const credential = response.credential;
    const userObject = JSON.parse(atob(credential.split(".")[1])); // Decoding JWT payload

    setUser(userObject);
  };

  return (
    <div>
      <h2>Google Login</h2>
      {user ? (
        <div>
          <h3>Welcome, {user.name}</h3>
          <img src={user.picture} alt="Profile" width="100" />
          <p>Email: {user.email}</p>
          <button onClick={() => setUser(null)}>Logout</button>
        </div>
      ) : (
        <div id="google-login-button"></div>
      )}
    </div>
  );
};

export default GoogleLogin;
