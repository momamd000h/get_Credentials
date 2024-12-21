import React, { useEffect } from "react";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";

const App = () => {
  useEffect(() => {
    // Configure Amplify
    Amplify.configure(awsconfig);
  }, []);

  return (
    <div className="App">
      <h1>Welcome to AWS Amplify in React</h1>
    </div>
  );
};

export default App;
