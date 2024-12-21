import React, { useEffect } from "react";
import AWS from "aws-sdk";
import { CognitoIdentityCredentials } from "aws-sdk";

const App = () => {
  useEffect(() => {
    // Set up AWS region and Cognito Identity Pool
    AWS.config.update({
      region: "eu-west-3", // Replace with your AWS region
      credentials: new CognitoIdentityCredentials({
        IdentityPoolId: "eu-west-3:9c23e48f-55f1-48bf-8303-acbbac502322", // Replace with your Cognito Identity Pool ID
      }),
    });

    // Create an IoTData instance to publish messages
    const iotdata = new AWS.IotData({
      endpoint: "your-iot-endpoint.iot.eu-west-3.amazonaws.com", // Replace with your IoT endpoint
    });

    // Example payload for the message
    const params = {
      topic: "your/topic", // Replace with your IoT topic
      payload: JSON.stringify({ message: "Hello from React app!" }),
      qos: 0, // Quality of Service level (0 or 1)
    };

    // Publish to the IoT topic
    iotdata.publish(params, (err, data) => {
      if (err) {
        console.error("Error publishing to IoT", err);
      } else {
        console.log("Successfully published to IoT:", data);
      }
    });
  }, []);

  return (
    <div className="App">
      <h1>Welcome to AWS IoT in React</h1>
    </div>
  );
};

export default App;
