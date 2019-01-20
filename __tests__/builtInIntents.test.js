const va = require('virtual-alexa');

const alexa = va.VirtualAlexa.Builder()
  .handler('index.handler')
  .interactionModelFile('./models/en-US.json')
  .create();

describe('LaunchRequestHandler', () => {
  test('Should trigger appropriately', async () => {
    const result = await alexa.launch();
    expect(result.response.outputSpeech.ssml
      .includes('Welcome to your Mercedes Benz car assistant'))
      .toBeTruthy();
  });
  test('Should reprompt user', async () => {
    const result = await alexa.launch();
    expect(result.response.reprompt).toBeDefined();
  });
});

describe('HelpIntentHandler', () => {
  test('Should trigger appropriately', async () => {
    const utter1 = await alexa.utter('What can you do');
    expect(utter1.response.outputSpeech.ssml.includes('You can ask me to')).toBeTruthy();
    const utter2 = await alexa.utter('I need help');
    expect(utter2.response.outputSpeech.ssml.includes('You can ask me to')).toBeTruthy();
  });
  test('Should reprompt user', async () => {
    const utter1 = await alexa.utter('help');
    expect(utter1.response.reprompt).toBeDefined();
  });
});

describe('CancelAndStopIntentHandler', () => {
  test('Should trigger appropriately', async () => {
    const utter1 = await alexa.utter('stop');
    expect(utter1.response.outputSpeech.ssml.includes('Goodbye')).toBeTruthy();
    const utter2 = await alexa.utter('cancel');
    expect(utter2.response.outputSpeech.ssml.includes('Goodbye')).toBeTruthy();
  });
  test('Should end session', async () => {
    const utter1 = await alexa.utter('stop');
    expect(utter1.response.shouldEndSession).toBeTruthy();
  });
});
