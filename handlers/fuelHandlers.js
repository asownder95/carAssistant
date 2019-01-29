const request = require('request-promise');
const { API_ENDPOINT } = require('../config');

const FuelStatusHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'FuelStatus';
  },
  async handle(handlerInput) {
    try {
      const { accessToken } = handlerInput.requestEnvelope.context.System.user;
      const { vehicleId } = handlerInput.attributesManager.getSessionAttributes();
      const results = await request({
        uri: `${API_ENDPOINT}/vehicles/${vehicleId}/fuel`,
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
      throw err;
    }
  },
};

module.exports = {
  FuelStatusHandler,
};
