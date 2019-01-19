const request = require('request-promise');
const { handleExpiredAccessToken } = require('./utils');

const DoorStatusHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'DoorStatus';
  },
  async handle(handlerInput) {
    try {
      const { accessToken } = handlerInput.attributesManager.getSessionAttributes();
      const results = await request({
        uri: `${process.env.API_ENDPOINT}/vehicles/${process.env.VEHICLE_ID}/doors`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      // Handle logic with results
    } catch (err) {
      if (err.statusCode === 401) {
        return handleExpiredAccessToken(handlerInput, DoorStatusHandler);
      }
      console.error(`This is the error: ${JSON.stringify(err)}`);
    }
  },
};

module.exports = {
  DoorStatusHandler,
};
