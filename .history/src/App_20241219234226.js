import * as Amplif from "aws-amplify"; // Correct import
import {
  IoTDataPlaneClient,
  PublishCommand,
} from "@aws-sdk/client-iot-data-plane"; // Correct import
import { Amplify } from "aws-amplify";
import { v4 as uuidv4 } from "uuid"; // For unique client ID generation
import awsconfig from "./aws-exports"; // AWS Amplify auto-generated configuration file
import { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
// Configure AWS Amplify
Amplify.configure(awsconfig);
const { Auth } = Amplif;

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Ensure user is authenticated before attempting to connect to IoT
    const connectToIoT = async () => {
      try {
        // Wait for the user to be signed in
        const currentUser = await Auth.currentAuthenticatedUser();
        console.log("User:", currentUser);

        // Get temporary credentials for AWS IoT
        const credentials = await Auth.currentCredentials();
        console.log("Temporary Credentials:", credentials);

        // Extract the temporary credentials
        const { accessKeyId, secretAccessKey, sessionToken } = credentials;

        // Create an IoT Data Plane client instance
        const iotClient = new IoTDataPlaneClient({
          region: "eu-west-3", // Adjust for your region
          credentials: {
            accessKeyId,
            secretAccessKey,
            sessionToken,
          },
        });

        // MQTT parameters
        const topic = "MAMDOUH"; // Topic to publish to
        const message = "Hello from AWS SDK!"; // The message to publish

        // Set up publishing parameters
        const publishParams = {
          topic,
          qos: 0,
          payload: message, // Payload to send
        };

        // Create the PublishCommand
        const publishCommand = new PublishCommand(publishParams);

        try {
          // Publish the message
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
