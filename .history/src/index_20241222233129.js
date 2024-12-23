import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports"; // Auto-generated file by Amplify
import App from "./App";
import "./index.css";
import Pubsub from "./pubsub";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

Amplify.configure(awsExports); // Configure Amplify with your backend

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Authenticator>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/Experiments" element={<Experiments />} />
          <Route path="/Interactive" element={<Interactive />} />
          <Route path="/tuning" element={<Tuning />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
          <Route path="/send" element={<Send />} />
        </Routes>
      </Router>
    </Authenticator>
  </React.StrictMode>
);
