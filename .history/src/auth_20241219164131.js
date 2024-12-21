import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import AWS from "aws-sdk";
import CryptoJS from "crypto-js";

// User Pool configuration
const poolData = {
  UserPoolId: "eu-west-3_lbYgofA6y", // Replace with your User Pool ID
  ClientId: "618vi583jn8p96pencm9it3ko", // Replace with your App Client ID
  ClientSecret: "nth0mnj801n3s5n18amt3mb2m18ln1q3qqccdono8heutg0t2bg", // Replace with your App Client Secret
};

const userPool = new CognitoUserPool(poolData);

// Function to calculate the SECRET_HASH
const calculateSecretHash = (username) => {
  const secretHash = CryptoJS.HmacSHA256(
    username + poolData.ClientId,
    poolData.ClientSecret
  ).toString(CryptoJS.enc.Base64);
  return secretHash;
};

// Sign-up function
export const signUp = (username, password, email) => {
  const attributeList = [{ Name: "email", Value: email }];

  // Include SECRET_HASH in the sign-up request
  const secretHash = calculateSecretHash(username);

  userPool.signUp(
    username,
    password,
    attributeList,
    { SecretHash: secretHash },
    (err, result) => {
      if (err) {
        console.error("Error signing up:", err);
        return;
      }
      console.log("Sign-up successful:", result.user);
    }
  );
};

// Sign-in function (as before)
export const signIn = (username, password) => {
  const user = new CognitoUser({ Username: username, Pool: userPool });
  const authDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  user.authenticateUser(authDetails, {
    onSuccess: (result) => {
      console.log("Successfully logged in:", result);

      // Set up AWS temporary credentials for AWS services access
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "YOUR_IDENTITY_POOL_ID", // Replace with your Identity Pool ID
        Logins: {
          [`cognito-idp.eu-west-3.amazonaws.com/eu-west-3_lbYgofA6y`]: result
            .getIdToken()
            .getJwtToken(),
        },
      });

      // Refresh the credentials
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
