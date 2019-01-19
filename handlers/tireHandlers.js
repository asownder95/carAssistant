const request = require('request-promise');
const { handleExpiredAccessToken } = require('./utils');

const TireStatusHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TireStatus';
  },
  async handle(handlerInput) {
    try {
      const { accessToken } = handlerInput.attributesManager.getSessionAttributes();
      const isMetricUnits = handlerInput.requestEnvelope
        .request.intent.slots.units.value.toLowerCase().includes('metric');
      const results = await request({
        uri: `${process.env.API_ENDPOINT}/vehicles/${process.env.VEHICLE_ID}/tires`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
          accept: 'application/json',
        },
      });
      return handlerInput.responseBuilder
        .speak(generateTireStatusResponse(JSON.parse(results), isMetricUnits))
        .getResponse();
    } catch (err) {
      if (err.statusCode === 401) {
        return handleExpiredAccessToken(handlerInput, TireStatusHandler);
      }
      throw err;
    }
  },
};

function generateTireStatusResponse (results, isMetricUnits) {
  const summary = {};
  let response = '';
  Object.keys(results).forEach((tire) => {
    const value = isMetricUnits ? results[tire].value : Math.round(results[tire].value * 0.145038);
    if (!summary[value]) {
      summary[value] = [tire.slice(12)];
    } else {
      summary[value].push(tire.slice(12));
    }
  });
  const uniqueValues = Object.keys(summary);
  if (uniqueValues.length === 1) {
    return `The pressure of all of the tires is ${uniqueValues[0]} ${isMetricUnits ? 'kilopascals.' : 'PSI.'}`;
  }
  uniqueValues.forEach((value) => {
    const tiresStr = `${summary[value].join(', ')} ${summary[value].length === 1 ? 'tire' : 'tires'}`;
    response += `The pressure of the ${tiresStr} is ${value} ${isMetricUnits ? 'kilopascals. ' : 'PSI. '}`;
  });
  return response;
}

module.exports = {
  TireStatusHandler,
};
