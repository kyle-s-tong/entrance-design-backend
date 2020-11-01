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
    }
  }
});
