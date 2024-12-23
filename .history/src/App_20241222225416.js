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

        // Fetch retained message every 5 seconds
        const intervalId = setInterval(fetchRetainedMessage, 100);

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

      const pubtopicname = "MAMDOUH";
      const payload = { message: message }; // Use the typed message as the payload
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
      console.log("Message published successfully:", data);
    } catch (err) {
      console.error("Error publishing message:", err);
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

            <h1>{user.username}!</h1>

            {/* Input field for the user to type their message */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)} // Update the message state
              placeholder="Type your message here"
              style={{
                width: "300px",
                height: "100px",
                marginBottom: "20px",
                padding: "10px",
                fontSize: "16px",
              }}
            ></textarea>

            {/* Button to publish the message */}
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
              Publish Message
            </button>

            {/* Box to display retained message */}
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
