import * as Amplif from "aws-amplify"; // Correct import
import { PublishCommand } from "@aws-sdk/client-iot-data-plane"; // Correct import
import { IoTClient } from "@aws-sdk/client-iot";
import { Amplify } from "aws-amplify";

import { v4 as uuidv4 } from "uuid"; // For unique client ID generation
import awsconfig from "./aws-exports"; // AWS Amplify auto-generated configuration file
import { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";

import { getCurrentUser } from "aws-amplify/auth";
const AWS = require("aws-sdk");

// Configure AWS Amplify
Amplify.configure(awsconfig);

// Initialize AWS credentials (you can set it through environment variables or AWS Amplify configuration)
AWS.config.update({
  region: "eu-west-3", // Replace with your region
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "eu-west-3:2f4a1e43-f18c-4639-adb6-5a0a36b1979d", // Replace with your Cognito Identity Pool ID
  }),
});

// Get credentials asynchronously
AWS.config.credentials.get(function (err) {
  if (err) {
    console.log("Error retrieving credentials:", err);
  } else {
    var accessKeyId = AWS.config.credentials.accessKeyId;
    var secretAccessKey = AWS.config.credentials.secretAccessKey;
    var sessionToken = AWS.config.credentials.sessionToken;

    console.log("Access Key:", accessKeyId);
    console.log("Secret Access Key:", secretAccessKey);
    console.log("Session Token:", sessionToken);
  }
});

function App() {
  const [isConnected, setIsConnected] = useState(false);

  const { Auth } = Amplif;

  useEffect(() => {
    const connectToIoT = async () => {
      const { username, userId, signInDetails } = await getCurrentUser();

      try {
        //console.log("username", username);
        //console.log("user id", userId);
        //console.log("sign-in details", signInDetails);

        // Check if user is authenticated before proceeding
        // const currentUser = await Auth.currentAuthenticatedUser();
        const currentUser = AWS.config.credentials.get;
        console.log("User:", currentUser);

        if (!currentUser) {
          console.error("No authenticated user found.");
          return;
        }
        // Get temporary credentials for AWS IoT
        const credentials = await Auth.currentCredentials();
        console.log("Temporary Credentials:", credentials);

        // Extract the temporary credentials
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
