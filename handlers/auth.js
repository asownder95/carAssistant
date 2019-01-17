exports.OauthHandler = {
  canHandle(handlerInput) {
    return !handlerInput.requestEnvelope.context.System.user.accessToken;
  },
  handle(handlerInput) {
    const speechText = 'You will need to log in to your Mercedes Benz account before using this skill. Follow the instructions that appear in your Alexa app.';
    return handlerInput.responseBuilder
      .speak(speechText)
      .withLinkAccountCard()
      .getResponse();
  },
};
