const Alexa = require('ask-sdk');
const {
  LaunchRequestHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  FallbackIntentHandler,
} = require('./handlers/builtInIntents');
const { DoorStatusHandler, LockCarHandler } = require('./handlers/doorHandlers');
const { ChargeStatusHandler } = require('./handlers/chargeHandlers');
const { FuelStatusHandler } = require('./handlers/fuelHandlers');
const { TireStatusHandler } = require('./handlers/tireHandlers');
const { AccountLinkingHandler } = require('./handlers/accountLinkingHandler');
const { AuthenticationInterceptor } = require('./handlers/authenticationInterceptor');
const { AlexaErrorHandler, MercedesAPIErrorHandler } = require('./handlers/errorHandlers');

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    AccountLinkingHandler,
    LaunchRequestHandler,
    DoorStatusHandler,
    LockCarHandler,
    ChargeStatusHandler,
    FuelStatusHandler,
    TireStatusHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
  )
  .addRequestInterceptors(AuthenticationInterceptor)
  .addErrorHandlers(
    AlexaErrorHandler,
    MercedesAPIErrorHandler,
  )
  .lambda();
