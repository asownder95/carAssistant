const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request-promise');
const redis = require('redis');

const redisClient = redis.createClient(process.env.REDISCLOUD_URL);
redisClient.on('connect', () => console.log('Redis connected.'));
redisClient.on('error', err => console.error(`Error from Redis: ${JSON.stringify(err)}`));

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/authorizationcode', (req, res) => {
  const authorizationURI = `https://api.secure.mercedes-benz.com/oidc10/auth/oauth/v2/authorize?response_type=code&client_id=${process.env.ClientID}&redirect_uri=${process.env.RedirectURI}&scope=${process.env.Scopes}`;
  res.redirect(authorizationURI);
});

app.get('/accesstoken', async (req, res) => {
  try {
    const { access_token, refresh_token } = await request({
      uri: 'https://api.secure.mercedes-benz.com/oidc10/auth/oauth/v2/token',
      method: 'POST',
      form: {
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: process.env.RedirectURI,
      },
      headers: {
        authorization: `Basic ${Buffer.from(`${process.env.ClientID}:${process.env.SecretClientID}`).toString('base64')}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    // Need to figure out a way to get userId parameter from Alexa skill context
    // Using "userId" as a hard-coded placeholder for now.
    redisClient.send('userId', `${access_token}:${refresh_token}`, () => {
      res.send('Successful!');
    });
  } catch (err) {
    res.send(err);
  }
});

app.listen(port, () => console.log(`Oauth server listening on port ${port}`));
