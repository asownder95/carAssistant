const va = require('virtual-alexa');

const alexa = va.VirtualAlexa.Builder()
  .handler('index.handler')
  .interactionModelFile('./models/en-US.json')
  .create();

describe('FuelStatusHandler', () => {
  test('Should trigger appropriately', async () => {
    const utter1 = await alexa.utter('Do I need to fill gas');
    expect(utter1.response.outputSpeech.ssml.includes('percent fuel remaining')).toBeTruthy();
    const utter2 = await alexa.utter('How much fuel is remaining');
    expect(utter2.response.outputSpeech.ssml.includes('percent fuel remaining')).toBeTruthy();
  });
});