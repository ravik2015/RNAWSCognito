import Amplify from "aws-amplify";

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: "XX-XXXX-X:XXXXXX-XXXX-XXXX-XXXX-XXXXXXXX",
    // REQUIRED - Amazon Cognito Region
    region: "XX-XXXX-X",
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "XX-XXXX-XXXXXXXX",
    // OPTIONAL - Amazon Cognito Web Client ID
    userPoolWebClientId: "XXXXXXXXXXXXXXXXXXXX"
  }
});
