import React, { useState, useEffect } from "react";
import "./pubsub.css";

const App = () => {
  const [angle, setAngle] = useState(0); // Pendulum angle in degrees
  const [velocity, setVelocity] = useState(0); // Angular velocity
  const [controlForce, setControlForce] = useState(0); // Control force applied
  const [mass, setMass] = useState(1); // Mass of the pendulum
  const [length, setLength] = useState(1); // Length of the pendulum
  const [damping, setDamping] = useState(0.1); // Damping coefficient
  const [running, setRunning] = useState(false); // Simulation status

  // Simulate the pendulum (placeholder for real physics simulation)
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
      <h1>Inverted Pendulum Simulation</h1>
      <div className="simulation-container">
        {/* Pendulum visualization */}
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
          <h3>Real-Time Data</h3>
          <p>Angle: {angle.toFixed(2)}°</p>
          <p>Velocity: {velocity.toFixed(2)} rad/s</p>
          <p>Control Force: {controlForce.toFixed(2)} N</p>
        </div>
      </div>
    </div>
  );
};

export default App;
