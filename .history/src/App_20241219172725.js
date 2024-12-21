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
    </div>
  );
}

export default App;
