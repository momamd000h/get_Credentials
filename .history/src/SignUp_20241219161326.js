import React, { useState } from "react";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import CryptoJS from "crypto-js"; // Import crypto-js for hashing

const poolData = {
  UserPoolId: "eu-west-3_lbYgofA6y", // Replace with your User Pool ID
  ClientId: "618vi583jn8p96pencm9it3ko", // Replace with your App Client ID
  ClientSecret: "nth0mnj801n3s5n18amt3mb2m18ln1q3qqccdono8heutg0t2bg", // Replace with your App Client Secret
};

const userPool = new CognitoUserPool(poolData);

const generateSecretHash = (username, clientId, clientSecret) => {
  const message = username + clientId;
  const hash = CryptoJS.HmacSHA256(message, clientSecret).toString(
    CryptoJS.enc.Base64
  );
  return hash;
};

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const signUp = (username, password, email) => {
    const secretHash = generateSecretHash(
      username,
      poolData.ClientId,
      poolData.ClientSecret
    );

    userPool.signUp(
      username,
      password,
      [{ Name: "email", Value: email }],
      null,
      (err, result) => {
        if (err) {
          setErrorMessage(err.message || JSON.stringify(err));
          setSuccessMessage("");
        } else {
          console.log("User registered:", result);
          setSuccessMessage(
            "Registration successful! Please check your email for confirmation."
          );
          setErrorMessage("");
        }
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    signUp(username, password, email);
  };

  return (
    <div>
      <h1>Sign Up</h1>
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">Sign Up</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default SignUp;
