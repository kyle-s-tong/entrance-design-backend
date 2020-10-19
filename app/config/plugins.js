module.exports = ({ env }) => ({
  // ...
  email: {
    provider: 'amazon-ses',
    providerOptions: {
      key: env('AWS_SES_KEY'),
      secret: env('AWS_SES_SECRET'),
      amazon: 'https://email-smtp.ap-southeast-2.amazonaws.com',
    },
    settings: {
      defaultFrom: 'hello@entrancedesign.co.nz',
      defaultReplyTo: 'hello@entrancedesign.co.nz',
    },
  },
  // ...
});
