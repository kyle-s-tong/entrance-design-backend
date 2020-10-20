module.exports = ({ env }) => ({
  // ...
  email: {
    provider: 'amazon-ses',
    providerOptions: {
      key: env('AWS_SES_KEY', 'AKIAX3BDJPREDVTHGUFE'),
      secret: env('AWS_SES_SECRET', 'BPX/RUQRoBZ8zFvvz9O2vrv1TvDSFZemLSx9V/O222oz'),
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
