import React, { useState, useEffect } from "react";
import {
  IoTDataPlaneClient,
  PublishCommand,
  GetRetainedMessageCommand,
} from "@aws-sdk/client-iot-data-plane";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import "@aws-amplify/ui-react/styles.css";
import { Buffer } from "buffer";
import "./pubsub.css"; // Import CSS for pendulum and IoT

// Configure AWS Amplify
Amplify.configure(awsconfig);

const App = () => {
  const [angle, setAngle] = useState(0); // Pendulum angle in degrees
  const [velocity, setVelocity] = useState(0); // Angular velocity
  const [controlForce, setControlForce] = useState(0); // Control force applied
  const [mass, setMass] = useState(1); // Mass of the pendulum
  const [length, setLength] = useState(1); // Length of the pendulum
  const [damping, setDamping] = useState(0.1); // Damping coefficient
  const [retainedMessage, setRetainedMessage] = useState(""); // IoT retained message
  const [isConnected, setIsConnected] = useState(false);
  const [running, setRunning] = useState(false); // Simulation running status

  // IoT Connection
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

        setIsConnected(true);

        // Periodically fetch retained messages
        const fetchRetainedMessage = async () => {
          try {
            const subscribeParams = {
              topic: "MAMDOUH2",
            };
            const subscribeCommand = new GetRetainedMessageCommand(
              subscribeParams
            );
            const response = await iotClient.send(subscribeCommand);
            const decodedPayload = Buffer.from(response.payload).toString(
              "utf-8"
            );
            const message = JSON.parse(decodedPayload);
            setRetainedMessage(message.message);

            // Update pendulum state from IoT message
            const { angle, velocity, controlForce } = message;
            if (angle !== undefined) setAngle(angle);
            if (velocity !== undefined) setVelocity(velocity);
            if (controlForce !== undefined) setControlForce(controlForce);
          } catch (err) {
            console.error("Error fetching retained message:", err);
          }
        };

        const intervalId = setInterval(fetchRetainedMessage, 1000);
        return () => clearInterval(intervalId);
      } catch (error) {
        console.error(
          "Error authenticating user or getting credentials:",
          error
        );
      }
    };

    connectToIoT();
  }, []);

  // Simulate the pendulum dynamics
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setAngle((prev) => prev + velocity);
        setVelocity((prev) => prev + controlForce - damping * prev);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [running, velocity, controlForce, damping]);

  // Handle IoT message publish
  const handlePublish = async () => {
    try {
      const iotClient = new IoTDataPlaneClient({
        region: "eu-west-3",
        credentials: fromCognitoIdentityPool({
          identityPoolId: "eu-west-3:2f4a1e43-f18c-4639-adb6-5a0a36b1979d",
          userIdentifier: "user_0",
        }),
      });

      const payload = { angle, velocity, controlForce };
      const encodedPayload = Buffer.from(JSON.stringify(payload));

      const publishParams = {
        topic: "MAMDOUH",
        qos: 0,
        payload: encodedPayload,
      };

      const publishCommand = new PublishCommand(publishParams);
      await iotClient.send(publishCommand);
      console.log("Message published successfully");
    } catch (err) {
      console.error("Error publishing message:", err);
    }
  };

  // Handle controls
  const handleStart = () => setRunning(true);
  const handleStop = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setAngle(0);
    setVelocity(0);
    setControlForce(0);
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
            {/* Pendulum Visualization */}
            <div className="pendulum-visualization">
              <div
                className="pendulum"
                style={{
                  transform: `rotate(${angle}deg)`,
                  height: `${length * 100}px`,
                }}
              ></div>
            </div>
            {/* Control Panel */}
            <div className="control-panel">
              <button onClick={handleStart} className="control-button">
                Start
              </button>
              <button onClick={handleStop} className="control-button">
                Stop
              </button>
              <button onClick={handleReset} className="control-button">
                Reset
              </button>
              <button onClick={handlePublish} className="control-button">
                Publish IoT State
              </button>
            </div>
            {/* Parameters Adjustment */}
            <div className="parameters">
              <h3>Parameters</h3>
              <div className="parameter">
                <label>Mass (kg): {mass}</label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={mass}
                  onChange={(e) => setMass(parseFloat(e.target.value))}
                />
              </div>
              <div className="parameter">
                <label>Length (m): {length}</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value))}
                />
              </div>
              <div className="parameter">
                <label>Damping: {damping}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={damping}
                  onChange={(e) => setDamping(parseFloat(e.target.value))}
                />
              </div>
            </div>
            {/* Real-Time Data */}
            <div className="data-display">
              <h3>Retained Message</h3>
              <p>{retainedMessage || "No message yet"}</p>
            </div>
          </div>
        )}
      </Authenticator>
    </div>
  );
};

export default App;
