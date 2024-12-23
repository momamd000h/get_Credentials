import {
  IoTDataPlaneClient,
  PublishCommand,
  GetRetainedMessageCommand,
} from "@aws-sdk/client-iot-data-plane";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import "@aws-amplify/ui-react/styles.css";
import { Buffer } from "buffer";
import "./pubsub.css"; // Import CSS

// Configure AWS Amplify
Amplify.configure(awsconfig);

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState(""); // State for message input
  const [retainedMessage, setRetainedMessage] = useState(""); // State for retained message
  const [pidValues, setPidValues] = useState({
    proportional: 1.0,
    integral: 0.0,
    derivative: 0.0,
  }); // State for PID values

  useEffect(() => {
    const connectToIoT = async () => {
      try {
        // Initialize the IoT client
        const iotClient = new IoTDataPlaneClient({
          region: "eu-west-3",
          credentials: fromCognitoIdentityPool({
            identityPoolId: "eu-west-3:2f4a1e43-f18c-4639-adb6-5a0a36b1979d",
            userIdentifier: "user_0",
          }),
        });

        // Set connection status to connected
        setIsConnected(true);

        // Periodically fetch the retained message
        const fetchRetainedMessage = async () => {
          try {
            const subscribeParams = {
              topic: "MAMDOUH2", // Topic to subscribe to
            };

            const subscribeCommand = new GetRetainedMessageCommand(
              subscribeParams
            );
            const response = await iotClient.send(subscribeCommand);

            const decodedPayload = Buffer.from(response.payload).toString(
              "utf-8"
            );
            const message = JSON.parse(decodedPayload);

            setRetainedMessage(message.message); // Update the retained message
          } catch (err) {
            console.error("Error fetching retained message:", err);
          }
        };

        // Fetch retained message every 0.1 seconds
        const intervalId = setInterval(fetchRetainedMessage, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
      } catch (error) {
        console.error(
          "Error authenticating user or getting credentials:",
          error
        );
      }
    };

    // Connect to IoT after user authentication
    connectToIoT();
  }, []);

  // Handle message publish
  const handlePublish = async () => {
    try {
      const iotClient = new IoTDataPlaneClient({
        region: "eu-west-3",
        credentials: fromCognitoIdentityPool({
          identityPoolId: "eu-west-3:2f4a1e43-f18c-4639-adb6-5a0a36b1979d",
          userIdentifier: "user_0",
        }),
      });

      // Publishing parameters
      const publishParams = {
        topic: pubtopicname,
        qos: 0,
        payload: encodedPayload,
      };
    } catch (err) {
      console.error("Error publishing message:", err);
    }
  };

  // Handle publishing PID values
  const handlePublishPID = async () => {
    try {
      const iotClient = new IoTDataPlaneClient({
        region: "eu-west-3",
        credentials: fromCognitoIdentityPool({
          identityPoolId: "eu-west-3:2f4a1e43-f18c-4639-adb6-5a0a36b1979d",
          userIdentifier: "user_0",
        }),
      });

      const pubtopicname = "MAMDOUH"; // Topic for PID
      const payload = { pid: pidValues }; // Use the PID object as the payload
      const encodedPayload = Buffer.from(JSON.stringify(payload));

      // Publishing parameters
      const publishParams = {
        topic: pubtopicname,
        qos: 0,
        payload: encodedPayload,
      };

      // Publish the message
      const publishCommand = new PublishCommand(publishParams);
      const data = await iotClient.send(publishCommand);
      console.log("PID values published successfully:", data);
    } catch (err) {
      console.error("Error publishing PID values:", err);
    }
  };

  return (
    <div className="container">
      <Authenticator>
        {({ user }) => (
          <div className="app-content">
            <h1>Welcome, {user.username}!</h1>
            <p>
              {isConnected
                ? "Connected to AWS IoT"
                : "Connecting to AWS IoT..."}
            </p>

            {/* Input field for the user to type their message */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here"
              className="message-input"
            ></textarea>

            {/* Button to publish the message */}
            <button onClick={handlePublish} className="publish-button">
              Publish Message
            </button>

            {/* Input fields for PID values */}
            <div className="pid-controls">
              <h3>Set PID Values</h3>
              <label>
                Proportional:
                <input
                  type="number"
                  value={pidValues.proportional}
                  onChange={(e) =>
                    setPidValues({
                      ...pidValues,
                      proportional: parseFloat(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Integral:
                <input
                  type="number"
                  value={pidValues.integral}
                  onChange={(e) =>
                    setPidValues({
                      ...pidValues,
                      integral: parseFloat(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Derivative:
                <input
                  type="number"
                  value={pidValues.derivative}
                  onChange={(e) =>
                    setPidValues({
                      ...pidValues,
                      derivative: parseFloat(e.target.value),
                    })
                  }
                />
              </label>
            </div>

            {/* Button to publish PID values */}
            <button onClick={handlePublishPID} className="publish-button">
              Publish PID Values
            </button>

            {/* Box to display retained message */}
            <div className="retained-message-box">
              <h3>Retained Message</h3>
              <p>{retainedMessage ? retainedMessage : "No message yet"}</p>
            </div>
          </div>
        )}
      </Authenticator>
    </div>
  );
}

export default App;
