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

  useEffect(() => {
    const connectToIoT = async () => {
      try {
        // Get the current authenticated user
        const currentUser = await Auth.currentAuthenticatedUser();

        // Get the user's unique ID (sub)
        con;
        // Initialize the IoT client
        const iotClient = new IoTDataPlaneClient({
          region: "eu-west-3",
          credentials: fromCognitoIdentityPool({
            identityPoolId: "eu-west-3:2f4a1e43-f18c-4639-adb6-5a0a36b1979d",
            userIdentifier: "user_0",
          }),
        });

        const pubtopicname = "MAMDOUH";
        const subtopicname = "MAMDOUH2"; // Topic to subscribe to
        const payload = { message: " mamam" };
        const encodedPayload = Buffer.from(JSON.stringify(payload));

        // Publishing parameters
        const publishParams = {
          topic: pubtopicname,
          qos: 0,
          payload: encodedPayload,
        };

        // Subscribing parameters
        const subscribeParams = {
          topic: subtopicname,
        };

        // Publishing to the IoT topic
        try {
          const publishCommand = new PublishCommand(publishParams);
          const data = await iotClient.send(publishCommand);
          console.log("Message published successfully:", data);
        } catch (err) {
          console.error("Error publishing message:", err);
        }

        // Subscribing to the IoT topic (get retained message)
        try {
          const subscribeCommand = new GetRetainedMessageCommand(
            subscribeParams
          );
          const response = await iotClient.send(subscribeCommand);

          const decodedPayload = Buffer.from(response.payload).toString(
            "utf-8"
          );
          const message = JSON.parse(decodedPayload);

          console.log("Received message:", message);
          console.log("Message content:", message.message);
        } catch (err) {
          console.error("Error receiving message:", err);
        }

        // Set connection status to connected
        setIsConnected(true);
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
          </div>
        )}
      </Authenticator>
    </div>
  );
}

export default App;
