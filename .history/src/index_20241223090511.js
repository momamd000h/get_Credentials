import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports"; // Auto-generated file by Amplify
import App from "./App";
import "./index.css";
import Pubsub from "./pubsub";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import reportWebVitals from "./reportWebVitals";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsExports); // Configure Amplify with your backend

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Authenticator>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/pubsub" element={<Pubsub />} />
        </Routes>
      </Router>
    </Authenticator>
  </React.StrictMode>
);
reportWebVitals();
