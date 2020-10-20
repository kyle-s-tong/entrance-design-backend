module.exports = ({ env }) => ({
  // ...
  email: {
    provider: 'amazon-ses',
    providerOptions: {
      key: env('AWS_API_KEY'),
      secret: env('AWS_SECRET_KEY'),
      amazon: 'https://email.ap-southeast-2.amazonaws.com',
    },
    settings: {
      defaultFrom: 'hello@entrancedesign.co.nz',
      defaultReplyTo: 'hello@entrancedesign.co.nz',
    },
  },
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
