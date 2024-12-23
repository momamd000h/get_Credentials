import React, { useEffect, useState } from "react";
import {
  IoTDataPlaneClient,
  PublishCommand,
  GetRetainedMessageCommand,
} from "@aws-sdk/client-iot-data-plane";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import "./pubsub.css"; // Import CSS

function App() {
  const [Kp, setKp] = useState(0); // Proportional gain
  const [Ki, setKi] = useState(0); // Integral gain
  const [Kd, setKd] = useState(0); // Derivative gain
  const [retainedMessage, setRetainedMessage] = useState(""); // Retained message state

  useEffect(() => {
    // Fetch retained message on load
    const fetchRetainedMessage = async () => {
      try {
        const iotClient = new IoTDataPlaneClient({
          region: "eu-west-3",
          credentials: fromCognitoIdentityPool({
            identityPoolId: "eu-west-3:2f4a1e43-f18c-4639-adb6-5a0a36b1979d",
          }),
        });

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
          setRetainedMessage(message.message);
        } else {
          setRetainedMessage("No retained message available");
        }
      } catch (err) {
        console.error("Error fetching retained message:", err);
      }
    };

    fetchRetainedMessage();
  }, []);

  const handlePublish = async () => {
    try {
      const iotClient = new IoTDataPlaneClient({
        region: "eu-west-3",
        credentials: fromCognitoIdentityPool({
          identityPoolId: "eu-west-3:2f4a1e43-f18c-4639-adb6-5a0a36b1979d",
        }),
      });

      const payload = {
        Kp: parseFloat(Kp),
        Ki: parseFloat(Ki),
        Kd: parseFloat(Kd),
      };

      const publishParams = {
        topic: "MAMDOUH", // Topic to publish PID
        qos: 0,
        payload: Buffer.from(JSON.stringify(payload)),
      };

      const publishCommand = new PublishCommand(publishParams);
      await iotClient.send(publishCommand);

      alert("PID parameters published successfully!");
    } catch (err) {
      console.error("Error publishing PID parameters:", err);
    }
  };

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

      {/* Publish Button */}
      <button onClick={handlePublish} className="publish-button">
        Publish PID Parameters
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
