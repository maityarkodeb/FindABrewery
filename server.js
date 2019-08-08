const express = require('express');
const request = require('request');
const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/autocomplete/:query', (req, res) => {
  request('https://api.openbrewerydb.org/breweries/autocomplete?query='+req.params.query+'', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({ data: body });
    }
  });
});

app.get('/singlesearch/:query', (req, res) => {
    request('https://api.openbrewerydb.org/breweries/'+req.params.query+'', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send({ data: body });
      }
    });
  });

