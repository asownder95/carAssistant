const Alexa = require('ask-sdk');
const { LaunchRequestHandler, ErrorHandler } = require('./handlers/builtInIntents');

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(LaunchRequestHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();
