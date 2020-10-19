if (process.env.NODE_ENV === 'production') {
  module.exports = {
    provider: "aws-s3",
    providerOptions: {
      accessKeyId: process.env.AWS_API_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: "ap-southeast-2",
      params: {
        Bucket: process.env.AWS_IMAGE_BUCKET
      }
    }
  };
} else {
  // to use the default local provider you can return an empty configuration
  module.exports = {};
}
