const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/authorization', (req, res) => {
  console.log('Hit the authorization endpoint');
  const authorizationURI = `https://api.secure.mercedes-benz.com/oidc10/auth/oauth/v2/authorize?response_type=code&client_id=${process.env.ClientID}&redirect_uri=${process.env.RedirectURI}&scope=mb:vehicle:status:general`;
  console.log(authorizationURI);
  res.redirect(authorizationURI);
});

app.get('/code', (req, res) => {
  console.log(`Hit the code endpoint, code is ${req.params.code}`);
  res.send();
});

app.listen(port, () => console.log(`Oauth server listening on port ${port}`));
