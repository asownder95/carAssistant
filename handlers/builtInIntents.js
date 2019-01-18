exports.LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    console.log(`This is the handlerInput object: ${JSON.stringify(handlerInput)}`);
    const speechText = 'Welcome to your Mercedes Benz car assistant, what would you like to do today?';
    console.log('Post speech text, should talk');
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};
