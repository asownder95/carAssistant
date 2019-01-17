const Alexa = require('ask-sdk');
const { LaunchRequestHandler, ErrorHandler } = require('./handlers/builtInIntents');
const { OauthHandler } = require('./handlers/auth');

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    OauthHandler,
    LaunchRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
