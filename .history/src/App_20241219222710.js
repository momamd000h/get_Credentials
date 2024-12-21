import React, { useState, useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";

import { Amplify } from "aws-amplify"; // Correct import
import * as Amplify from "aws-amplify"; // Correct import
const Auth = Amplify;
import mqtt from "mqtt";
import "@aws-amplify/ui-react/styles.css";
import awsconfig from "./aws-exports"; // AWS Amplify auto-generated configuration file
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique client IDs

// Configure AWS Amplify
Amplify.configure(awsconfig);

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

        // Use the credentials to connect to AWS IoT
        const iotEndpoint = "a3c1jrwyyxkjx6-ats.iot.eu-west-3.amazonaws.com"; // Replace with your IoT endpoint
        const clientId = `mqtt-client-${uuidv4()}`; // Creates a unique client ID using UUID

        // MQTT connection
        const client = mqtt.connect(`wss://${iotEndpoint}/mqtt`, {
          clientId,
          username: "", // Empty username, as it is not required in most cases
          password: sessionToken, // Use the session token as the password
          clean: true,
          reconnectPeriod: 1000,
          keepalive: 60,
          protocolVersion: 4,
          aws_access_key_id: accessKeyId,
          aws_secret_access_key: secretAccessKey,
          sessionToken,
        });

        client.on("connect", function () {
          setIsConnected(true); // Update connection status
          console.log("Connected to AWS IoT");

          // Subscribe to a topic
          client.subscribe("MAMDOUH", function (err) {
            if (err) {
              console.error("Error subscribing:", err);
            } else {
              console.log("Successfully subscribed to topic.");
            }
          });
        });

        client.on("message", function (topic, message) {
          console.log(
            `Received message on topic ${topic}: ${message.toString()}`
          );
        });

        client.on("error", function (err) {
          console.error("Error:", err);
        });
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
