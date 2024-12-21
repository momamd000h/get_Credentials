import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To display error messages
  const [loading, setLoading] = useState(false); // For loading state

  return (
    <div className="App">
      <h1>Login to AWS Cognito</h1>

      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={handleSignIn} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <h2>Sign Up</h2>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button onClick={handleSignUp} disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}

export default App;
