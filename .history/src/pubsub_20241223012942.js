import React, { useEffect, useState } from "react";
import {
  IoTDataPlaneClient,
  GetRetainedMessageCommand,
} from "@aws-sdk/client-iot-data-plane";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import "./pubsub.css"; // Import CSS
import { Buffer } from "buffer";

function App() {
  const [retainedMessage, setRetainedMessage] = useState(""); // State for retained message

  // Set up the IoT client
  const iotClient = new IoTDataPlaneClient({
    region: "eu-west-3",
    credentials: fromCognitoIdentityPool({
      identityPoolId: "eu-west-3:2f4a1e43-f18c-4639-adb6-5a0a36b1979d", // Replace with your Identity Pool ID
    }),
  });

  // Function to fetch retained message
  const fetchRetainedMessage = async () => {
    try {
      const subscribeParams = {
        topic: "MAMDOUH2", // Topic to fetch retained message
      };

      const subscribeCommand = new GetRetainedMessageCommand(subscribeParams);
      const response = await iotClient.send(subscribeCommand);

      if (response.payload) {
        const decodedPayload = Buffer.from(response.payload).toString("utf-8");
        const message = JSON.parse(decodedPayload);
        setRetainedMessage(message.message); // Set the retained message to state
      } else {
        setRetainedMessage("No retained message available");
      }
    } catch (err) {
      console.error("Error fetching retained message:", err);
    }
  };

  // Fetch retained message every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchRetainedMessage();
    }, 1000); // Fetch retained message every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []); // Empty dependency array to run only once when component mounts

  return (
    <div className="container">
      <h1>Retained Message Viewer</h1>

      {/* Display the retained message */}
      <div className="retained-message-box">
        <h3>Retained Message</h3>
        <p>{retainedMessage || "Fetching retained message..."}</p>
      </div>
    </div>
  );
}

export default App;
