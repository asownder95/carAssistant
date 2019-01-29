const request = require('request-promise');
const { API_ENDPOINT } = require('../config');

const DoorStatusHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'DoorStatus';
  },
  async handle(handlerInput) {
    try {
      const { accessToken } = handlerInput.requestEnvelope.context.System.user;
      const { vehicleId } = handlerInput.attributesManager.getSessionAttributes();
      const results = await request({
        uri: `${API_ENDPOINT}/vehicles/${vehicleId}/doors`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      return handlerInput.responseBuilder
        .speak(generateDoorStatusResponse(JSON.parse(results)))
        .getResponse();
    } catch (err) {
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
      const { accessToken } = handlerInput.requestEnvelope.context.System.user;
      const { vehicleId } = handlerInput.attributesManager.getSessionAttributes();
      const action = handlerInput.requestEnvelope
        .request.intent.slots.action.value.toLowerCase().includes('un') ? 'UNLOCK' : 'LOCK';
      const results = await request({
        uri: `${API_ENDPOINT}/vehicles/${vehicleId}/doors`,
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
