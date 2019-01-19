const redis = require('redis');
const { REDISCLOUD_URL } = require('../config');

// console.log(`NEWLY ADDED CONSOLE.LOG: redis_url= ${REDISCLOUD_URL}`);
// const redisClient = redis.createClient(REDISCLOUD_URL);
// redisClient.on('connect', () => console.log('Redis connected'));
// redisClient.on('error', err => console.error(`Error from Redis: ${JSON.stringify(err)}`));

exports.AuthenticationInterceptor = {
  async process(handlerInput) {
    try {
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      if (!attributes.accessToken) {
        const tokens = await new Promise((resolve) => {
          const redisClient = redis.createClient(REDISCLOUD_URL);
          redisClient.get('userId', (err, res) => {
            if (err) {
              throw err;
            }
            redisClient.quit();
            resolve(res);
          });
        });
        if (!tokens) {
          const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
          handlerInput.attributesManager.setRequestAttributes(Object.assign(requestAttributes, { login: true }));
        } else {
          const [accessToken, refreshToken] = tokens.split(':');
          handlerInput.attributesManager.setSessionAttributes(Object.assign(attributes, { accessToken, refreshToken }));
        }
      }
    } catch (err) {
      throw err;
    }
  },
};
