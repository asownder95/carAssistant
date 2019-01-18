exports.AccountLinkingHandler = {
  canHandle(handlerInput) {
    const { login } = handlerInput.attributesManager.getRequestAttributes();
    return !!login;
  },
  handle(handlerInput) {
    const speechText = 'You will need to log in to your Mercedes Benz account before using this skill. Follow the instructions that appear in your Alexa app.';
    return handlerInput.responseBuilder
      .speak(speechText)
      .withLinkAccountCard()
      .getResponse();
  },
};
