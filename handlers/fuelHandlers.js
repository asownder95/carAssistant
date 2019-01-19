const request = require('request-promise');
const { handleExpiredAccessToken } = require('./utils');

const FuelStatusHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'FuelStatus';
  },
  async handle(handlerInput) {
    try {
      const { accessToken } = handlerInput.attributesManager.getSessionAttributes();
      const results = await request({
        uri: `${process.env.API_ENDPOINT}/vehicles/${process.env.VEHICLE_ID}/fuel`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
          accept: 'application/json',
        },
      });
      return handlerInput.responseBuilder
        .speak(`The car has ${JSON.parse(results).fuellevelpercent.value} percent fuel remaining.`)
        .getResponse();
    } catch (err) {
      if (err.statusCode === 401) {
        return handleExpiredAccessToken(handlerInput, FuelStatusHandler);
      }
      throw err;
    }
  },
};

module.exports = {
  FuelStatusHandler,
};
