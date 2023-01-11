// this uses dynamodb to read api key signatures
// signature types are..
// tmp - this is not stored in db.
// live / test - this is stored in db.

const CORS_API_KEY_HEADER = "x-cors-api-key";

// API Gateway authorizer for serverless functions
module.exports.authorize = async (event) => {
  // get the api key from the header
  const key = event.headers[CORS_API_KEY_HEADER];
  // const { mode, signature } = keyinfo(key);

  // switch (mode) {
  //   case "temp": {
  //     break;
  //   }
  //   case "live": {
  //     break;
  //   }
  //   case "test": {
  //     break;
  //   }
  //   case "v2022": {
  //     //
  //   }
  // }

  // Authorized
  return {
    principalId: "user",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: event.methodArn,
        },
      ],
    },

    // Optional context
    context: {
      key,
    },

    // Optional output with custom properties of the String, Number or Boolean type.
    usageIdentifierKey: "123456789",
  };
};
