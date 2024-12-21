import React, { useEffect } from "react";
import AWS from "aws-sdk";
import { CognitoIdentityCredentials } from "aws-sdk";

const App = () => {
  useEffect(() => {
    // Set up AWS region and Cognito Identity Pool
    AWS.config.update({
      region: "eu-west-3", // Replace with your AWS region
      credentials: new CognitoIdentityCredentials({
        IdentityPoolId: "eu-west-3:9c23e48f-55f1-48bf-8303-acbbac502322", // Replace with your Cognito Identity Pool ID
      }),
    });

    // Initialize the AWS service (for example, S3)
    const s3 = new AWS.S3();

    // Now you can use AWS services with the temporary credentials
    s3.listBuckets({}, (err, data) => {
      if (err) {
        console.error("Error fetching buckets", err);
      } else {
        console.log("Buckets:", data.Buckets);
      }
    });
  }, []);

  return (
    <div className="App">
      <h1>Welcome to AWS SDK in React</h1>
    </div>
  );
};

export default App;
