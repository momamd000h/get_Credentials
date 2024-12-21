import React, { useState } from "react";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import CryptoJS from "crypto-js";

// Replace with your actual pool data
const poolData = {
  UserPoolId: "eu-west-3_lbYgofA6y", // Replace with your User Pool ID
  ClientId: "618vi583jn8p96pencm9it3ko", // Replace with your App Client ID
  ClientSecret: "nth0mnj801n3s5n18amt3mb2m18ln1q3qqccdono8heutg0t2bg", // Replace with your App Client Secret
};

const userPool = new CognitoUserPool(poolData);

// Function to generate SECRET_HASH for sign-in with a client secret
const generateSecretHash = (username, clientId, clientSecret) => {
  const message = username + clientId;
  const hash = CryptoJS.HmacSHA256(message, clientSecret);
  return CryptoJS.enc.Base64.stringify(hash);
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const secretHash = generateSecretHash(
      username,
      poolData.ClientId,
      poolData.ClientSecret
    );

    const user = new CognitoUser({ Username: username, Pool: userPool });
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    // Sign-in attempt
    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        setLoading(false);
        setSuccessMessage("Successfully logged in!");
        console.log("Successfully logged in:", result);
        // Use the token to authenticate AWS services (example)
        AWS.config.credentials.params.Logins = {
          [`cognito-idp.YOUR_AWS_REGION.amazonaws.com/YOUR_USER_POOL_ID`]:
            result.getIdToken().getJwtToken(),
        };
        AWS.config.credentials.refresh((err) => {
          if (err) {
            console.error("Error refreshing credentials:", err);
          } else {
            console.log("Successfully refreshed credentials");
          }
        });
      },
      onFailure: (err) => {
        setLoading(false);
        setErrorMessage(err.message || "Failed to sign in.");
        console.error("Failed to sign in:", err);
      },
    });
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default Login;
