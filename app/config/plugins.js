module.exports = ({ env }) => ({
  // ...
  email: {
    provider: 'amazon-ses',
    providerOptions: {
      key: env('AWS_SES_KEY', 'AKIAX3BDJPREDVTHGUFE'),
      secret: env('AWS_SES_SECRET', 'BPX/RUQRoBZ8zFvvz9O2vrv1TvDSFZemLSx9V/O222oz'),
      amazon: 'https://email-smtp.ap-southeast-2.amazonaws.com:587',
    },
    settings: {
      defaultFrom: 'hello@entrancedesign.co.nz',
      defaultReplyTo: 'hello@entrancedesign.co.nz',
    },
  },
  // ...
});
