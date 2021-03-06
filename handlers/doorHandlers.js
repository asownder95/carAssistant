const request = require('request-promise');
const { handleExpiredAccessToken } = require('./utils');
const { API_ENDPOINT, VEHICLE_ID } = require('../config');

const DoorStatusHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'DoorStatus';
  },
  async handle(handlerInput) {
    try {
      const { accessToken } = handlerInput.attributesManager.getSessionAttributes();
      const results = await request({
        uri: `${API_ENDPOINT}/vehicles/${VEHICLE_ID}/doors`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      return handlerInput.responseBuilder
        .speak(generateDoorStatusResponse(JSON.parse(results)))
        .getResponse();
    } catch (err) {
      if (err.statusCode === 401) {
        return handleExpiredAccessToken(handlerInput, DoorStatusHandler);
      }
      throw err;
    }
  },
};

const LockCarHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'LockCar';
  },
  async handle(handlerInput) {
    try {
      const { accessToken } = handlerInput.attributesManager.getSessionAttributes();
      const action = handlerInput.requestEnvelope
        .request.intent.slots.action.value.toLowerCase().includes('un') ? 'UNLOCK' : 'LOCK';
      const results = await request({
        uri: `${API_ENDPOINT}/vehicles/${VEHICLE_ID}/doors`,
        method: 'POST',
        headers: {
          authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: action,
        }),
      });
      return handlerInput.responseBuilder
        .speak(`Sure, ${action === 'LOCK' ? 'locking' : 'unlocking'} your Mercedes-Benz right now.`)
        .getResponse();
    } catch (err) {
      if (err.statusCode === 401) {
        return handleExpiredAccessToken(handlerInput, LockCarHandler);
      }
      throw err;
    }
  },
};

function generateDoorStatusResponse (results) {
  let response = '';
  const summary = {
    open: [],
    unlocked: [],
  };
  Object.keys(results).slice(0, -1).forEach((key) => {
    if (results[key].value === 'OPEN') {
      summary.open.push(key.slice(10));
    } else if (results[key].value === 'UNLOCKED') {
      summary.unlocked.push(key.slice(14));
    }
  });
  if (summary.open.length === 0) {
    response += 'All the doors in the vehicle are closed. ';
  } else if (summary.open.length === 4) {
    response += 'All the doors in the vehicle are open. ';
  } else {
    response += `The ${summary.open.join(', ')} ${summary.open.length === 1 ? 'door is' : 'doors are'} open. `;
  }
  if (summary.unlocked.length === 0) {
    response += 'All of the doors are currently locked.';
  } else if (summary.unlocked.length === 4) {
    response += 'All of the doors are curently unlocked.';
  } else {
    response += `The ${summary.unlocked.join(', ')} doors are currently unlocked.`;
  }
  return response;
}

module.exports = {
  DoorStatusHandler,
  LockCarHandler,
};
