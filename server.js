const express = require('express');
const path = require('path');
const request = require('request');

require('dotenv').config();

let access_token = '';

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',

    form: {
      grant_type: 'client_credentials',
    },

    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
        ).toString('base64'),
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    access_token = body.access_token;

    res.sendFile(path.join(__dirname, 'index.html'));
  });
});

app.get('/search', function (req, res) {
  console.log(req.originalUrl);
  let authOptions = {
    url: `https://api.spotify.com/v1${req.originalUrl}&type=album%2Cartist%2Ctrack&limit=3&market=pl`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
  };
  request.get(authOptions, function (error, response, body) {
    if (error) {
      res.send(error);
    }
    res.send(body);
  });
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '404.html'));
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
