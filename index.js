const Alexa = require('ask-sdk');
const {
  LaunchRequestHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  FallbackIntentHandler,
} = require('./handlers/builtInIntents');
const { DoorStatusHandler, LockCarHandler } = require('./handlers/doorHandlers');
const { ChargeStatusHandler } = require('./handlers/chargeHandlers');
const { AccountLinkingHandler } = require('./handlers/accountLinkingHandler');
const { AuthenticationInterceptor } = require('./handlers/authenticationInterceptor');
const { ErrorHandler } = require('./handlers/errorHandlers');

exports.handler = async (event, context) => {
  // This line of code allows handlers to return despite open redisClient connection
  context.callbackWaitsForEmptyEventLoop = false;
  return Alexa.SkillBuilders.custom()
    .addRequestHandlers(
      AccountLinkingHandler,
      LaunchRequestHandler,
      DoorStatusHandler,
      LockCarHandler,
      ChargeStatusHandler,
      HelpIntentHandler,
      CancelAndStopIntentHandler,
      FallbackIntentHandler,
    )
    .addRequestInterceptors(AuthenticationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .create()
    .invoke(event, context);
};
