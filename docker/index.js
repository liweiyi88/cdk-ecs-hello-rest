'use strict'
var express = require('express');

var app = module.exports = express();

app.get('/', function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: 'hello' });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(80);
  app.disable('etag');
  console.log('Express started on port 80');
}
