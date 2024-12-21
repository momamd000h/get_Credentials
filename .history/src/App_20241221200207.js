import * as Amplify from "aws-amplify"; // Correct import
import { PublishCommand } from "@aws-sdk/client-iot-data-plane"; // Correct import
import { IoTClient } from "@aws-sdk/client-iot";
import { Amplify } from "aws-amplify";

import { v4 as uuidv4 } from "uuid"; // For unique client ID generation
import awsconfig from "./aws-exports"; // AWS Amplify auto-generated configuration file
import { useEffect, useState } from "react";
import { Authenticator, Auth } from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";

// Configure AWS Amplify
Amplify.configure(awsconfig);

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectToIoT = async () => {
      try {
        // Get current authenticated user using Amplify Auth
        const currentUser = await Auth.currentAuthenticatedUser();
        console.log("Authenticated User:", currentUser);

        // Get temporary credentials for AWS IoT
        const credentials = await Auth.currentCredentials();
        console.log("Temporary Credentials:", credentials);

        const { accessKeyId, secretAccessKey, sessionToken } = credentials;

        // Create an IoT client instance
        const iotClient = new IoTClient({
          region: "eu-west-3", // Adjust for your region
          credentials: {
            accessKeyId,
            secretAccessKey,
            sessionToken,
          },
        });

        // MQTT parameters
        const iotEndpoint = "a3c1jrwyyxkjx6-ats.iot.eu-west-3.amazonaws.com"; // Replace with your IoT endpoint
        const clientId = `mqtt-client-${uuidv4()}`; // Creates a unique client ID using UUID
        const topic = "MAMDOUH"; // Topic to subscribe to

        // Set up publishing
        const publishParams = {
          topic,
          qos: 0,
          payload: "Hello from AWS SDK!",
        };

        const publishCommand = new PublishCommand(publishParams);

        try {
          // Publish to the IoT topic
          const data = await iotClient.send(publishCommand);
          console.log("Message published successfully:", data);
        } catch (err) {
          console.error("Error publishing message:", err);
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

    // Call the function to connect to IoT if the user is authenticated
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
          </div>
        )}
      </Authenticator>
    </div>
  );
}

export default App;
