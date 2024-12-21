import { Amplify, PubSub } from "aws-amplify";
import React, { useState, useEffect } from "react";

// Configure Amplify to use Cognito Identity Pool for temporary credentials
Amplify.configure({
  Auth: {
    identityPoolId: "eu-west-3:9c23e48f-55f1-48bf-8303-acbbac502322", // Replace with your Identity Pool ID
    region: "eu-west-3", // Replace with your region, e.g., 'eu-west-3'
  },
});

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {}, []);

  return (
    <div>
      <h1>Pub/Sub with AWS IoT and Amplify</h1>
      <p>Message from topic: {message}</p>
    </div>
  );
}

export default App;
