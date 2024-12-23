import { useEffect, useState } from "react";
import {
  IoTDataPlaneClient,
  PublishCommand,
  GetRetainedMessageCommand,
} from "@aws-sdk/client-iot-data-plane";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Buffer } from "buffer";
import "./pubsub.css"; // Import CSS

function App() {
  const [retainedMessage, setRetainedMessage] = useState(""); // State for retained message
  const [pidValue1, setPidValue1] = useState(""); // State for PID value 1
  const [pidValue2, setPidValue2] = useState(""); // State for PID value 2
  const [pidValue3, setPidValue3] = useState(""); // State for PID value 3

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

  // Function to publish all PID values to the same topic
  const publishAllPids = async () => {
    try {
      const payload = {
        pidValue1,
        pidValue2,
        pidValue3,
      }; // Include all PID values in the payload
      const encodedPayload = Buffer.from(JSON.stringify(payload));

      const publishParams = {
        topic: "MAMDOUH_PID", // Same topic for all PID values
        qos: 0,
        payload: encodedPayload,
      };

      const publishCommand = new PublishCommand(publishParams);
      const data = await iotClient.send(publishCommand);
      console.log("PID values published successfully:", data);
    } catch (err) {
      console.error("Error publishing PID values:", err);
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

      {/* Three containers for PID values */}
      <div className="pid-container">
        <div className="pid-input">
          <label htmlFor="pidValue1">Enter PID Value 1:</label>
          <input
            type="number"
            id="pidValue1"
            value={pidValue1}
            onChange={(e) => setPidValue1(e.target.value)}
            placeholder="Enter PID value 1"
          />
        </div>
      </div>

      <div className="pid-container">
        <div className="pid-input">
          <label htmlFor="pidValue2">Enter PID Value 2:</label>
          <input
            type="number"
            id="pidValue2"
            value={pidValue2}
            onChange={(e) => setPidValue2(e.target.value)}
            placeholder="Enter PID value 2"
          />
        </div>
      </div>

      <div className="pid-container">
        <div className="pid-input">
          <label htmlFor="pidValue3">Enter PID Value 3:</label>
          <input
            type="number"
            id="pidValue3"
            value={pidValue3}
            onChange={(e) => setPidValue3(e.target.value)}
            placeholder="Enter PID value 3"
          />
        </div>
      </div>

      {/* Single button to publish all PID values */}
      <button onClick={publishAllPids} className="publish-button">
        Publish All PID Values
      </button>
    </div>
  );
}

export default App;
