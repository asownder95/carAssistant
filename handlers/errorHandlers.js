const logError = (error) => {
  if (!error.statusCode && !error.message) {
    console.error(`Error: ${JSON.stringify(error)}`);
  } else {
    console.error(`Error status code: ${error.statusCode}`);
    console.error(`Error message: ${error.message}`);
  }
};

exports.AlexaErrorHandler = {
  canHandle(handlerInput, error) {
    return error.name.startsWith('AskSdk');
  },
  handle(handlerInput, error) {
    logError(error);
    const speechText = 'Sorry, I didn\'t understand that command. Please try again';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

exports.MercedesAPIErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    logError(error);
    let speechText;
    switch (error.statusCode) {
      case 204:
        speechText = 'I was not able to pull up any information on that. Sorry!';
        break;
      case 403:
        speechText = 'Unfortunately, I do not have the necessary permission to get that information. Check your Alexa app to modify the permissions I have access to.';
        break;
      case 429:
        speechText = 'Sorry, I was not able to get that information right now. Please try again in a little while.';
        break;
      case 500:
        speechText = 'There is currenty an issue with the Mercedes Benz servers. Please try again in a little while.';
        break;
      case 408:
        speechText = 'I was not able to connect to your Mercedes Benz car. Sorry!';
        break;
      case 404:
        speechText = 'I was not able to find the information you are looking for. Sorry!';
        break;
      default:
        speechText = 'There was a problem with my request for that information. Sorry about the inconvenience!';
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};
