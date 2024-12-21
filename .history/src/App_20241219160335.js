// App.js
import React from "react";
import Login from "./Login"; // Import the Login component

const App = () => {
  return (
    <div className="App">
      <h1>Welcome to AWS Cognito Authentication</h1>
      <Login /> {/* Render the Login component */}
    </div>
  );
};

export default App;
