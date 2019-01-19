const va = require('virtual-alexa');

const alexa = va.VirtualAlexa.Builder()
  .handler('index.handler')
  .interactionModelFile('./models/en-US.json')
  .create();

describe('LaunchRequestHandler', () => {
  test('Should respond with welcome response', async () => {
    const result = await alexa.launch();
    expect(result.response.outputSpeech.ssml
      .includes('Welcome to your Mercedes Benz car assistant'))
      .toBeTruthy();
  });
});
