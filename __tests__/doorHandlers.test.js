const va = require('virtual-alexa');

const alexa = va.VirtualAlexa.Builder()
  .handler('index.handler')
  .interactionModelFile('./models/en-US.json')
  .create();

describe('DoorStatusHandler', () => {
  test('Should trigger appropriately', async () => {
    const utter1 = await alexa.utter('check the doors');
    expect(utter1.response.outputSpeech.ssml.includes('doors')).toBeTruthy();
  });
});

describe('LockCarHandler', () => {
  test('Should trigger and respond appropriately', async () => {
    const utter1 = await alexa.utter('Lock the car');
    expect(utter1.response.outputSpeech.ssml.includes('locking your Mercedes-Benz')).toBeTruthy();
    const utter2 = await alexa.utter('unlock the car');
    expect(utter2.response.outputSpeech.ssml.includes('unlocking your Mercedes-Benz')).toBeTruthy();
  });
});
