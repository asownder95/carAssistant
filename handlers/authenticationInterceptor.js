const redis = require('redis');

const redisClient = redis.createClient(process.env.REDISCLOUD_URL);
redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('error', err => console.error(`Error from Redis: ${JSON.stringify(err)}`));

exports.AuthenticationInterceptor = {
  async process(handlerInput) {
    try {
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      console.log(`Step 1: Attributes - ${JSON.stringify(attributes)}`);
      if (!attributes.accessToken) {
        const tokens = await new Promise((resolve) => {
          redisClient.get('userId', (err, res) => {
            resolve(res);
          });
        });
        console.log(`Step 2: tokens ${tokens}`);
        if (!tokens) {
          const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
          handlerInput.attributesManager.setRequestAttributes(Object.assign(requestAttributes, { login: true }));
          console.log('Step 3: set request attributes');
        } else {
          const [accessToken, refreshToken] = tokens.split(':');
          handlerInput.attributesManager.setSessionAttributes(Object.assign(attributes, { accessToken, refreshToken }));
          console.log(`Step 4: set session attributes. This is handlerInput: ${JSON.stringify(handlerInput)}`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  },
};
