import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import AWS from "aws-sdk";

// User Pool configuration
const poolData = {
  UserPoolId: "eu-west-3_lbYgofA6y", // Replace with your User Pool ID
  ClientId: "618vi583jn8p96pencm9it3ko", // Replace with your App Client ID
};

const userPool = new CognitoUserPool(poolData);

// Sign-in function
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
        IdentityPoolId: "eu-west-3:9c23e48f-55f1-48bf-8303-acbbac502322", // Replace with your Identity Pool ID
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

// Sign-up function
export const signUp = (username, password, email) => {
  const attributeList = [{ Name: "email", Value: email }];

  userPool.signUp(username, password, attributeList, null, (err, result) => {
    if (err) {
      console.error("Error signing up:", err);
      return;
    }
    console.log("Sign-up successful:", result.user);
  });
};
