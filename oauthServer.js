const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request-promise');

const app = express();
const port = process.env.PORT || 3000;

let currentUserCredentials;

app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/authorizationcode', (req, res) => {
  const authorizationURI = `https://api.secure.mercedes-benz.com/oidc10/auth/oauth/v2/authorize?response_type=code&client_id=${process.env.ClientID}&redirect_uri=${process.env.RedirectURI}&scope=${process.env.Scopes}`;
  res.redirect(authorizationURI);
});

app.get('/accesstoken', async (req, res) => {
  const result = await request({
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
  console.log(`This is the result post-request in accesstoken endpoint: ${JSON.stringify(result)}`);
  currentUserCredentials = result;
  res.send('Successful!');
});

app.listen(port, () => console.log(`Oauth server listening on port ${port}`));
