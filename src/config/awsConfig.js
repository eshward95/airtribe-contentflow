const { S3Client } = require("@aws-sdk/client-s3");
const config = require("./config");

const credentials = {
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey,
};

const s3Client = new S3Client({
  endpoint: "https://s3.tebi.io",
  credentials: credentials,
  region: "global",
});

module.exports = s3Client;
