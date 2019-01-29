const request = require('request-promise');
const { API_ENDPOINT } = require('../config');

exports.AuthenticationInterceptor = {
  async process(handlerInput) {
    try {
      const { accessToken } = handlerInput.requestEnvelope.context.System.user;
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      if (!accessToken) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        handlerInput.attributesManager.setRequestAttributes(Object.assign(requestAttributes, { login: true }));
      } else if (!sessionAttributes.vehicleId) {
        const vehicleList = JSON.parse(await request({
          uri: `${API_ENDPOINT}/vehicles`,
          method: 'GET',
          headers: {
            authorization: `Bearer ${accessToken}`,
            accept: 'application/json',
          },
        }));
        handlerInput.attributesManager.setSessionAttributes(Object.assign(sessionAttributes, { vehicleId: vehicleList[0].id }));
      }
    } catch (err) {
      throw err;
    }
  },
};
