// connect to DB
require('./db/connect');
var express = require('express');
var bodyParser = require('body-parser');
var itemRoutes = require('./routes/item');
var app = express();

// parse body to JSON
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/', itemRoutes);
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

app.listen(8080, function() {
  console.log('Listening on port 8080');
});

exports.app = app;