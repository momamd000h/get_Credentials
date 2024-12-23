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

// Configure AWS Amplify
Amplify.configure(awsconfig);

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState(""); // State for message input
  const [retainedMessage, setRetainedMessage] = useState(""); // State for retained message

  // PID Control Values (P, I, D)
  const [P, setP] = useState(0);
  const [I, setI] = useState(0);
  const [D, setD] = useState(0);

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

            setRetainedMessage(message); // Update the retained message with the parameters
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

  // Handle PID value publish
  const handlePublish = async () => {
    try {
      const iotClient = new IoTDataPlaneClient({
        region: "eu-west-3",
        credentials: fromCognitoIdentityPool({
          identityPoolId: "eu-west-3:2f4a1e43-f18c-4639-adb6-5a0a36b1979d",
          userIdentifier: "user_0",
        }),
      });

      const pubtopicname = "MAMDOUH"; // The topic for publishing PID control values
      const payload = { P, I, D }; // Send the PID values as payload
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
      console.log("PID Values published successfully:", data);
    } catch (err) {
      console.error("Error publishing PID values:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Authenticator>
        {({ signOut, user }) => (
          <div>
            <h1>Welcome, {user.username}!</h1>
            <p>You are now signed in.</p>
            <button
              onClick={signOut}
              style={{
                padding: "10px 20px",
                backgroundColor: "#FF5733",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>

            {isConnected ? (
              <p>Connected to AWS IoT</p>
            ) : (
              <p>Connecting to AWS IoT...</p>
            )}

            <h2>PID Control Values</h2>

            {/* PID input fields */}
            <div>
              <label>
                P (Proportional):
                <input
                  type="number"
                  value={P}
                  onChange={(e) => setP(parseFloat(e.target.value))}
                  style={{ margin: "10px" }}
                />
              </label>
              <br />
              <label>
                I (Integral):
                <input
                  type="number"
                  value={I}
                  onChange={(e) => setI(parseFloat(e.target.value))}
                  style={{ margin: "10px" }}
                />
              </label>
              <br />
              <label>
                D (Derivative):
                <input
                  type="number"
                  value={D}
                  onChange={(e) => setD(parseFloat(e.target.value))}
                  style={{ margin: "10px" }}
                />
              </label>
            </div>

            {/* Button to publish the PID values */}
            <button
              onClick={handlePublish}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Publish PID Values
            </button>

            {/* Box to display retained message with inverted pendulum parameters */}
            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
                width: "80%",
                maxWidth: "600px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <h3>Retained Inverted Pendulum Parameters</h3>
              <pre>
                {JSON.stringify(retainedMessage, null, 2) || "No message yet"}
              </pre>
            </div>
          </div>
        )}
      </Authenticator>
    </div>
  );
}

export default App;
