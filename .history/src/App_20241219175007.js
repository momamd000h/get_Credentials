import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import { Auth } from "@aws-amplify/auth"; // Import Auth from @aws-amplify/auth

// Configure AWS Amplify
Amplify.configure({
  Auth: {
    identityPoolId: "eu-west-3:9c23e48f-55f1-48bf-8303-acbbac502322", // Replace with your Identity Pool ID
    region: "eu-west-3", // Replace with your region
    userPoolId: "eu-west-3_lbYgofA6y", // Replace with your User Pool ID
    userPoolWebClientId: "618vi583jn8p96pencm9it3ko", // Replace with your User Pool Web Client ID
  },
});

function App() {
  const [email, setEmail] = useState(""); // Email input
  const [password, setPassword] = useState(""); // Password input
  const [errorMessage, setErrorMessage] = useState(""); // For displaying errors
  const [loading, setLoading] = useState(false); // For loading state
  const [isSignedIn, setIsSignedIn] = useState(false); // To track sign-in status

  // Sign-up function
  const handleSignUp = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      // Attempt to sign up the user with Cognito
      await Auth.signUp({
        username: email,
        password: password,
        attributes: { email }, // You can add other attributes here like name
      });
      setLoading(false);
      alert("Sign-up successful. Please verify your email.");
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message); // Display the error message
    }
  };

  // Sign-in function
  const handleSignIn = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      // Attempt to sign in the user with Cognito
      const user = await Auth.signIn(email, password);
      setIsSignedIn(true); // Update sign-in status
      setLoading(false);
      console.log("Sign-in successful:", user);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message); // Display the error message
    }
  };

  return (
    <div className="App">
      <h1>Login to AWS Cognito</h1>

      {/* Email and Password Inputs */}
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email value
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password value
        />
      </div>

      {/* Sign-up / Sign-in buttons */}
      <div>
        <button onClick={handleSignUp} disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <button onClick={handleSignIn} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>

      {/* Display error messages */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Display success message if signed in */}
      {isSignedIn && <p>Welcome, you are signed in!</p>}
    </div>
  );
}

export default App;