const va = require('virtual-alexa');

const alexa = va.VirtualAlexa.Builder()
  .handler('index.handler')
  .interactionModelFile('./models/en-US.json')
  .create();

describe('TireStatusHandler', () => {
  test('Should trigger appropriately', async () => {
    const utter1 = await alexa.utter('check my tire pressure');
    console.log(utter1);
    expect(utter1.response.outputSpeech.ssml.includes('pressure')).toBeTruthy();
  });
});
