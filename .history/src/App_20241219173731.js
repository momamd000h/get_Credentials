import React, { useState } from "react";
import { Auth } from "aws-amplify";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To display error messages
  const [loading, setLoading] = useState(false); // For loading state
  const [isSignedIn, setIsSignedIn] = useState(false); // To track sign-in status

  // Sign-up function
  const handleSignUp = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const signUpResponse = await Auth.signUp({
        username: email, // Here, you use email as the username
        password: password,
        attributes: { email }, // You can add other attributes here
      });
      setLoading(false);
      alert("Sign-up successful. Please verify your email.");
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };

  // Sign-in function
  const handleSignIn = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const user = await Auth.signIn(email, password);
      setIsSignedIn(true);
      setLoading(false);
      console.log("Sign-in successful:", user);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
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
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
