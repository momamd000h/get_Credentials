import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports"; // Auto-generated file by Amplify
import App from "./App";
import "./index.css";

Amplify.configure(awsExports); // Configure Amplify with your backend

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <Route path="/send" element={<Send />} />
  </React.StrictMode>
);
