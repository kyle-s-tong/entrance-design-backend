module.exports = ({ env }) => ({
  key: env('ACTIVE_CAMPAIGN_KEY'),
  host: env('ACTIVE_CAMPAIGN_HOST')
});
