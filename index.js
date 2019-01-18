const Alexa = require('ask-sdk');
const { LaunchRequestHandler, ErrorHandler } = require('./handlers/builtInIntents');
const { OauthInterceptor } = require('./handlers/auth');

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
  )
  .addRequestInterceptors(OauthInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();
