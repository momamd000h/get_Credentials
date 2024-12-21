// App.js
import React, { useState } from "react";

const App = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);

  const toggleForm = () => {
    setIsSigningUp(!isSigningUp);
  };

  return (
    <div className="App">
      <h1>Welcome to AWS Cognito Authentication</h1>
      {isSigningUp ? <SignUp /> : <Login />}
      <button onClick={toggleForm}>
        {isSigningUp
          ? "Already have an account? Log in"
          : "Don't have an account? Sign up"}
      </button>
    </div>
  );
};

export default App;
