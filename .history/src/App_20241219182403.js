import { Amplify, PubSub } from "aws-amplify";
import React, { useState, useEffect } from "react";

// Configure Amplify to use Cognito Identity Pool for temporary credentials
Amplify.configure({
  Auth: {
    identityPoolId: "eu-west-3:9c23e48f-55f1-48bf-8303-acbbac502322", // Replace with your Identity Pool ID
    region: "eu-west-3", // Replace with your region, e.g., 'eu-west-3'
  },
  PubSub: {
    aws_pubsub_region: "eu-west-3", // Region for Pub/Sub
    aws_pubsub_endpoint: "a3c1jrwyyxkjx6-ats.iot.eu-west-3.amazonaws.com", // Replace with your IoT endpoint
  },
});

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Subscribe to a topic (example)
    const subscription = PubSub.subscribe("MAMDOUH").subscribe({
      next: (data) => {
        setMessage(data.value); // Get the message
      },
      error: (error) => console.error(error),
      close: () => console.log("Closed subscription"),
    });

    return () => subscription.unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const publishMessage = async () => {
    try {
      // Publish to the topic
      await PubSub.publish("MAMDOUH", { message: "Hello from the client!" });
      console.log("Message published");
    } catch (error) {
      console.error("Error publishing message:", error);
    }
  };

  return (
    <div>
      <h1>Pub/Sub with AWS IoT and Amplify</h1>
      <p>Message from topic: {message}</p>
      <button onClick={publishMessage}>Publish Message</button>
    </div>
  );
}

export default App;
