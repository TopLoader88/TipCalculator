const { expo } = require('./app.json');

module.exports = {
  ...expo,
  ...(process.env.WEB_BASE_PATH ? {
    experiments: { ...expo.experiments, baseUrl: process.env.WEB_BASE_PATH },
  } : {}),
};