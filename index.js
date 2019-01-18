const Alexa = require('ask-sdk');
const { LaunchRequestHandler, ErrorHandler } = require('./handlers/builtInIntents');
const { LoginRequestHandler } = require('./handlers/LoginRequestHandler');
const { OauthInterceptor } = require('./handlers/auth');

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LoginRequestHandler,
    LaunchRequestHandler,
  )
  .addRequestInterceptors(OauthInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();
