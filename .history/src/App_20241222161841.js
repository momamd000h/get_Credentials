import {
  IoTDataPlaneClient,
  PublishCommand,
  GetRetainedMessageCommand,
} from "@aws-sdk/client-iot-data-plane"; // Correct import
import { Amplify } from "aws-amplify";

import { v4 as uuidv4 } from "uuid"; // For unique client ID generation
import awsconfig from "./aws-exports"; // AWS Amplify auto-generated configuration file
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
        const iotClient = new IoTDataPlaneClient({
          region: "eu-west-3",
          credentials: fromCognitoIdentityPool({
            identityPoolId: "eu-west-3:2f4a1e43-f18c-4639-adb6-5a0a36b1979d",
            userIdentifier: "user_0",
          }),
        });
        //console.log("Authenticated User:", accessKeyId);

        const pubtopicname = "MAMDOUH";
        const subtopicname = "MAMDOUH2"; // Topic to subscribe to
        const payload = {
          message: " from AWS SDK!",
        };
        const encodedPayload = Buffer.from(JSON.stringify(payload));
        // Set up publishing
        const publishParams = {
          topic: pubtopicname,
          qos: 0,
          payload: encodedPayload,
          //retain: true
        };
        const subscribeParams = {
          topic: subtopicname,
        };

        const publishCommand = new PublishCommand(publishParams);
        const subscribeCommand = new GetRetainedMessageCommand(subscribeParams);
        try {
          // Publish to the IoT topic
          const response = await iotClient.send(subscribeCommand);
          //const responsejson = await response.JSON();

          // Decode base64 payload (for browsers)
          //const decodedPayload = atob(response.payload);

          // Parse JSON
          //const message = JSON.parse(decodedPayload);

          //console.log(message);
          //console.log(message.message);
          const decodedPayload = Buffer.from(response.payload).toString(
            "utf-8"
          );

          // Parse JSON
          const message = JSON.parse(decodedPayload);

          console.log(message); // Full JSON message
          console.log(message.message); // Access "message" field
          //const decodedString = response.payload//.map(code => String.fromCharCode(code)).join('');
          //console.log("Message recieved successfully:", response);
          const data = await iotClient.send(publishCommand);
          console.log("Message published successfully:", data);
        } catch (err) {
          console.error("Error publishing or recieving message:", err);
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
              {" "}
              <h1>Welcome, {user.username}!</h1>
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
