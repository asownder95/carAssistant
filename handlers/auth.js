const redis = require('redis');

const redisClient = redis.createClient(process.env.REDISCLOUD_URL);
redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('error', err => console.error(`Error from Redis: ${JSON.stringify(err)}`));

exports.OauthInterceptor = {
  process(handlerInput) {
    try {
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      if (!attributes.accessToken) {
        const tokens = redisClient.get('userId');
        if (!tokens) {
          handlerInput.attributesManager.setRequestAttributes({ login: true });
        } else {
          const [accessToken, refreshToken] = tokens.split(':');
          handlerInput.attributesManager.setSessionAttributes(Object.assign(attributes, { accessToken, refreshToken }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  },
};
