const request = require('request-promise');
const { API_ENDPOINT } = require('../config');

const ChargeStatusHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ChargeStatus';
  },
  async handle(handlerInput) {
    try {
      const { accessToken } = handlerInput.requestEnvelope.context.System.user;
      const { vehicleId } = handlerInput.attributesManager.getSessionAttributes();
      const results = await request({
        uri: `${API_ENDPOINT}/vehicles/${vehicleId}/stateofcharge`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
          accept: 'application/json',
        },
      });
      return handlerInput.responseBuilder
        .speak(`Your Mercedes-Benz's battery has ${JSON.parse(results).stateofcharge.value} percent remaining.`)
        .getResponse();
    } catch (err) {
      throw err;
    }
  },
};

module.exports = {
  ChargeStatusHandler,
};
