var express = require('express');
var bodyParser = require('body-parser');
var decodeAdeunisRF = require('./adeunis');

var PORT = process.env.PORT || 8000;

var asserver = express();

// handle POST requests on /fluxon
asserver.post("/fluxon", bodyParser.json(), decodeAdeunisRF, function(req, res) {
  console.log(req.body.frmPayload);
  console.log(req.body.decodedPayload);

  res.end();
});

// Start listening
asserver.listen(PORT, function() {
  console.log("server started on port "+PORT);
});
