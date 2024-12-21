// Login.js
import React, { useState } from "react";
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import AWS from "aws-sdk";

const poolData = {
  UserPoolId: "eu-west-3_lbYgofA6y", // Replace with your User Pool ID
  ClientId: "618vi583jn8p96pencm9it3ko", // Replace with your App Client ID
};

const userPool = new CognitoUserPool(poolData);

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const signIn = (username, password) => {
    const user = new CognitoUser({ Username: username, Pool: userPool });
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log("Successfully logged in:", result);
        // Retrieve Cognito identity pool credentials
        AWS.config.credentials.params.Logins = {
          [`cognito-idp.YOUR_AWS_REGION.amazonaws.com/YOUR_USER_POOL_ID`]:
            result.getIdToken().getJwtToken(),
        };

        // Now you can access AWS services with temporary credentials
        AWS.config.credentials.refresh((err) => {
          if (err) {
            console.error("Error refreshing credentials:", err);
          } else {
            console.log("Successfully refreshed credentials");
          }
        });
      },
      onFailure: (err) => {
        console.error("Failed to sign in:", err);
        setErrorMessage("Login failed: " + err.message); // Show error message
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(username, password);
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default Login;
