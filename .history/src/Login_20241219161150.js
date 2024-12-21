import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import AWS from "aws-sdk";
import CryptoJS from "crypto-js"; // You'll need to install this dependency

const poolData = {
  UserPoolId: "YOUR_USER_POOL_ID", // Replace with your User Pool ID
  ClientId: "YOUR_APP_CLIENT_ID", // Replace with your App Client ID
  ClientSecret: "YOUR_APP_CLIENT_SECRET", // Replace with your App Client Secret
};

const userPool = new CognitoUserPool(poolData);

// Function to generate the SECRET_HASH
const generateSecretHash = (username, clientId, clientSecret) => {
  const message = username + clientId;
  const hash = CryptoJS.HmacSHA256(message, clientSecret);
  return hash.toString(CryptoJS.enc.Base64);
};

// Sign-in function
const signIn = (username, password) => {
  const user = new CognitoUser({ Username: username, Pool: userPool });
  const authDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
    SecretHash: generateSecretHash(
      username,
      poolData.ClientId,
      poolData.ClientSecret
    ),
  });

  user.authenticateUser(authDetails, {
    onSuccess: (result) => {
      console.log("Successfully logged in:", result);
      // Retrieve Cognito identity pool credentials
      AWS.config.credentials.params.Logins = {
        [`cognito-idp.YOUR_AWS_REGION.amazonaws.com/YOUR_USER_POOL_ID`]: result
          .getIdToken()
          .getJwtToken(),
      };

      // Now you can access AWS services with temporary credentials
      AWS.config.credentials.refresh((err) => {
        if (err) {
          console.error("Error refreshing credentials:", err);
        } else {
          console.log("Successfully refreshed credentials");
        }
      });
    },
    onFailure: (err) => {
      console.error("Failed to sign in:", err);
    },
  });
};
