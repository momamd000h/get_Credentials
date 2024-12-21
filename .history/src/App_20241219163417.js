import React, { useState } from "react";
import { signIn, signUp } from "./auth"; // Import the authentication functions

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSignIn = () => {
    signIn(username, password);
  };

  const handleSignUp = () => {
    signUp(username, password, email);
  };

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
        <button onClick={handleSignIn}>Sign In</button>
      </div>

      <h2>Sign Up</h2>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button onClick={handleSignUp}>Sign Up</button>
      </div>
    </div>
  );
}

export default App;
