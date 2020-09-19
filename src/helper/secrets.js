// Loading the AWS SDK
const AWS = require('aws-sdk');
const region = 'ap-south-1';
const secretName = 'ktk-secrets';

// Create a Secrets Manager Client
const client = new AWS.SecretsManager({
  region: region
});

async function getSecrets() {
  return new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: secretName }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.SecretString);
      }
    });
  });
}

module.exports = getSecrets;
