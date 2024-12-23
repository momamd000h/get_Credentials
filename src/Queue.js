// src/Queue.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Queue = () => {
  const navigate = useNavigate(); // Hook to handle navigation

  useEffect(() => {
    // Start the timer when the component mounts
    const timer = setTimeout(() => {
      // After 5 seconds, redirect the user back to the App component
      navigate("/"); // Redirect to the App component (main page)
    }, 5000); // 5 seconds in milliseconds

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <p>Waiting for the next available experiment...</p>
    </div>
  );
};

export default Queue;
