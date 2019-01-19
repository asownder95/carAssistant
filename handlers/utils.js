const request = require('request-promise');
const { AccountLinkingHandler } = require('./accountLinkingHandler');

const handleExpiredAccessToken = async (handlerInput, requestHandler) => {
  console.log('Access token expired.');
  const { refreshToken } = handlerInput.attributesManager.getSessionAttributes();
  const results = JSON.parse(await request({
    uri: `https://car-assistant-alexa.herokuapp.com/refreshtoken?refresh_token=${refreshToken}`,
    method: 'GET',
  }));
  console.log(`Refresh token endpoint query results: ${JSON.stringify(results)}`);
  if (results === 'Expired') {
    console.log('Refresh token expired.');
    return AccountLinkingHandler.handle(handlerInput);
  }
  if (results.error) {
    throw new Error(results.message);
  }
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  handlerInput.attributesManager.setSessionAttributes(
    Object.assign(attributes, { accessToken: results.access_token, refreshToken: results.refresh_token }),
  );
  return requestHandler.handle(handlerInput);
};

module.exports = {
  handleExpiredAccessToken,
};
