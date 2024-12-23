import React, { useEffect, useState } from "react";
import {
  IoTDataPlaneClient,
  PublishCommand,
  GetRetainedMessageCommand,
} from "@aws-sdk/client-iot-data-plane";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import "./pubsub.css"; // Import CSS
import { Buffer } from "buffer";

function App() {
  const [Kp, setKp] = useState(0); // Proportional gain
  const [Ki, setKi] = useState(0); // Integral gain
  const [Kd, setKd] = useState(0); // Derivative gain
  const [retainedMessage, setRetainedMessage] = useState(""); // Retained message state

  // Set up the IoT client
  const iotClient = new IoTDataPlaneClient({
    region: "eu-west-3",
    credentials: fromCognitoIdentityPool({
      identityPoolId: "eu-west-3:2f4a1e43-f18c-4639-adb6-5a0a36b1979d", // Replace with your Identity Pool ID
    }),
  });

  // Fetch retained message initially
  useEffect(() => {
    const fetchRetainedMessage = async () => {
      try {
        const subscribeParams = {
          topic: "MAMDOUH2", // Topic to fetch retained message
        };

        const subscribeCommand = new GetRetainedMessageCommand(subscribeParams);
        const response = await iotClient.send(subscribeCommand);

        if (response.payload) {
          const decodedPayload = Buffer.from(response.payload).toString(
            "utf-8"
          );
          const message = JSON.parse(decodedPayload);
          setRetainedMessage(message.message); // Set the retained message to state
        } else {
          setRetainedMessage("No retained message available");
        }
      } catch (err) {
        console.error("Error fetching retained message:", err);
      }
    };

    fetchRetainedMessage();
  }, []);

  // Function to publish real-time retained message
  const publishRealTimeMessage = async () => {
    try {
      // Prepare the updated message payload
      const payload = {
        message: `Real-time PID Data - Kp: ${Kp}, Ki: ${Ki}, Kd: ${Kd}`,
      };

      const publishParams = {
        topic: "MAMDOUH", // Topic to publish real-time PID values
        qos: 0,
        payload: Buffer.from(JSON.stringify(payload)), // Make sure the payload is a Buffer
      };

      const publishCommand = new PublishCommand(publishParams);

      // Send the publish command to AWS IoT
      const data = await iotClient.send(publishCommand);
      console.log("Real-time message published successfully:", data);
    } catch (err) {
      console.error("Error publishing real-time message:", err);
    }
  };

  // Update real-time message every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      publishRealTimeMessage();
    }, 1000); // Publish every second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [Kp, Ki, Kd]); // Re-publish if PID parameters change

  return (
    <div className="container">
      <h1>PID Controller</h1>

      {/* PID Parameter Input */}
      <div className="pid-controls">
        <h3>Set PID Parameters</h3>
        <label htmlFor="kp">Kp (Proportional Gain):</label>
        <input
          type="number"
          id="kp"
          value={Kp}
          onChange={(e) => setKp(e.target.value)}
        />

        <label htmlFor="ki">Ki (Integral Gain):</label>
        <input
          type="number"
          id="ki"
          value={Ki}
          onChange={(e) => setKi(e.target.value)}
        />

        <label htmlFor="kd">Kd (Derivative Gain):</label>
        <input
          type="number"
          id="kd"
          value={Kd}
          onChange={(e) => setKd(e.target.value)}
        />
      </div>

      {/* Publish Button (Optional if you want to trigger manually) */}
      <button onClick={publishRealTimeMessage} className="publish-button">
        Publish Real-Time PID Parameters
      </button>

      {/* Retained Message Display */}
      <div className="retained-message-box">
        <h3>Retained Message</h3>
        <p>{retainedMessage || "Fetching retained message..."}</p>
      </div>
    </div>
  );
}

export default App;
