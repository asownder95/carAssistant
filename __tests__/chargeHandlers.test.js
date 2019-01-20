const va = require('virtual-alexa');

const alexa = va.VirtualAlexa.Builder()
  .handler('index.handler')
  .interactionModelFile('./models/en-US.json')
  .create();

describe('ChargeStatusHandler', () => {
  test('Should trigger appropriately', async () => {
    const utter1 = await alexa.utter('How much charge is remaining');
    expect(utter1.response.outputSpeech.ssml.includes('battery')).toBeTruthy();
    const utter2 = await alexa.utter('How much battery is left');
    expect(utter2.response.outputSpeech.ssml.includes('battery')).toBeTruthy();
  });
});
