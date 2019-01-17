const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(morgan('dev'));

app.post('/webhook', (req, res) => {
  console.log(`This is the request object: ${JSON.stringify(req)}`);
  res.send('Response from webhook!');
});

app.listen(port, () => console.log(`Webhook server listening on port ${port}`));
