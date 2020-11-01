module.exports = ({ env }) => ({
  upload: {
    provider: 'aws-s3',
    providerOptions: {
      accessKeyId: env('AWS_API_KEY'),
      secretAccessKey: env('AWS_SECRET_KEY'),
      region: "ap-southeast-2",
      params: {
        Bucket: env('AWS_IMAGE_BUCKET'),
      },
    },
  },
  // ...
});
