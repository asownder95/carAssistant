const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request-promise');
const redis = require('redis');

const redisClient = redis.createClient(process.env.REDISCLOUD_URL);
redisClient.on('error', err => console.error(`Error from Redis: ${JSON.stringify(err)}`));

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/authorizationcode', (req, res) => {
  const authorizationURI = `https://api.secure.mercedes-benz.com/oidc10/auth/oauth/v2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=${process.env.SCOPES}`;
  res.redirect(authorizationURI);
});

app.get('/accesstoken', async (req, res) => {
  try {
    const tokenObj = await request({
      uri: 'https://api.secure.mercedes-benz.com/oidc10/auth/oauth/v2/token',
      method: 'POST',
      form: {
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: process.env.REDIRECT_URI,
      },
      headers: {
        authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.SECRET_CLIENT_ID}`).toString('base64')}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    const { access_token, refresh_token } = JSON.parse(tokenObj);
    // Need to figure out a way to get userId parameter from Alexa skill context
    // Using "userId" as a hard-coded userid placeholder for now.
    redisClient.set('userId', `${access_token}:${refresh_token}`, () => {
      res.send('Successful!');
    });
  } catch (err) {
    res.send(`We were unable to link your account. Please try again later. ${err.message}`);
  }
});

app.get('/refreshtoken', async (req, res) => {
  try {
    const tokenObj = await request({
      uri: 'https://api.secure.mercedes-benz.com/oidc10/auth/oauth/v2/token',
      method: 'POST',
      form: {
        grant_type: 'refresh_token',
        refresh_token: req.query.refresh_token,
      },
      headers: {
        authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.SECRET_CLIENT_ID}`).toString('base64')}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    const { access_token, refresh_token } = JSON.parse(tokenObj);
    redisClient.set('userId', `${access_token}:${refresh_token}`, () => {
      res.send(tokenObj);
    });
  } catch (err) {
    if (err.statusCode === 400) {
      // If refresh token has expired or invalid
      res.json('Expired');
    } else {
      res.json(err);
    }
  }
});

app.listen(port, () => console.log(`Oauth server listening on port ${port}`));
