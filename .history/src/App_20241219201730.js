import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.username}</h1>
          {/* Add logout button or other features */}
        </div>
      ) : (
        <div>
          <SignIn />
          <SignUp />
        </div>
      )}
    </div>
  );
};

export default App;
