import React from "react";
import { AmplifyProvider, Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function App() {
  return (
    <AmplifyProvider>
      <Authenticator>
        {({ signOut, user }) => (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
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
          </div>
        )}
      </Authenticator>
    </AmplifyProvider>
  );
}

export default App;
