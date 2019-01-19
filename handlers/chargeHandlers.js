const request = require('request-promise');
const { handleExpiredAccessToken } = require('./utils');

const ChargeStatusHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ChargeStatus';
  },
  async handle(handlerInput) {
    try {
      const { accessToken } = handlerInput.attributesManager.getSessionAttributes();
      const results = await request({
        uri: `${process.env.API_ENDPOINT}/vehicles/${process.env.VEHICLE_ID}/stateofcharge`,
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
      console.log(`EARLIER ERROR: ${JSON.stringify(err)}`);
      if (err.statusCode === 401) {
        return handleExpiredAccessToken(handlerInput, ChargeStatusHandler);
      }
      throw err;
    }
  },
};

module.exports = {
  ChargeStatusHandler,
};
