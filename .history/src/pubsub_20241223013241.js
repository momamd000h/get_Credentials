import React, { useEffect, useState } from "react";
import {
  IoTDataPlaneClient,
  PublishCommand,
  GetRetainedMessageCommand,
} from "@aws-sdk/client-iot-data-plane";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Buffer } from "buffer";
import "./pubsub.css"; // Import CSS
import { Buffer } from "buffer";

function App() {
  const [retainedMessage, setRetainedMessage] = useState(""); // State for retained message
  const [pidValue, setPidValue] = useState(""); // State for PID value

  // Set up the IoT client
  const iotClient = new IoTDataPlaneClient({
    region: "eu-west-3",
    credentials: fromCognitoIdentityPool({
      identityPoolId: "eu-west-3:2f4a1e43-f18c-4639-adb6-5a0a36b1979d", // Replace with your Identity Pool ID
    }),
  });

  // Function to fetch the retained message
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

  // Function to publish the PID value
  const publishPid = async () => {
    try {
      const pubtopicname = "MAMDOUH_PID"; // Topic for PID publishing
      const payload = { pidValue: pidValue }; // Payload to send
      const encodedPayload = Buffer.from(JSON.stringify(payload));

      const publishParams = {
        topic: pubtopicname,
        qos: 0,
        payload: encodedPayload,
      };

      const publishCommand = new PublishCommand(publishParams);
      const data = await iotClient.send(publishCommand);
      console.log("PID value published successfully:", data);
    } catch (err) {
      console.error("Error publishing PID value:", err);
    }
  };

  // Fetch the retained message periodically every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchRetainedMessage();
    }, 5000); // Fetch retained message every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []); // Empty dependency array to run only once when component mounts

  return (
    <div className="container">
      <h1>Retained Message and PID Publisher</h1>

      {/* Display retained message */}
      <div className="retained-message-box">
        <h3>Retained Message</h3>
        <p>{retainedMessage || "Fetching retained message..."}</p>
      </div>

      {/* Input for PID value */}
      <div className="pid-input">
        <label htmlFor="pidValue">Enter PID Value:</label>
        <input
          type="number"
          id="pidValue"
          value={pidValue}
          onChange={(e) => setPidValue(e.target.value)}
          placeholder="Enter PID value"
        />
      </div>

      {/* Button to publish PID value */}
      <button onClick={publishPid} className="publish-button">
        Publish PID Value
      </button>
    </div>
  );
}

export default App;
