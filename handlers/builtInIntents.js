exports.LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    console.log(`This is the handlerInput object: ${JSON.stringify(handlerInput)}`);
    const speechText = 'Welcome to your Mercedes Benz car assistant, what would you like to do today?';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};
