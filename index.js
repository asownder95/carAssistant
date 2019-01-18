const Alexa = require('ask-sdk');
const { LaunchRequestHandler, ErrorHandler } = require('./handlers/builtInIntents');
const { LoginRequestHandler } = require('./handlers/LoginRequestHandler');
const { OauthInterceptor } = require('./handlers/auth');

exports.handler = async (event, context) => {
  // This line of code allows handlers to return despite open redisClient connection
  context.callbackWaitsForEmptyEventLoop = false;
  return Alexa.SkillBuilders.custom()
    .addRequestHandlers(
      LoginRequestHandler,
      LaunchRequestHandler,
    )
    .addRequestInterceptors(OauthInterceptor)
    .addErrorHandlers(ErrorHandler)
    .create()
    .invoke(event, context);
};
