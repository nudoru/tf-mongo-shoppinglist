var express = require('express');
var Item = require('../services/items');
var router = express.Router();

// list
router.get('/items', function(req, res) {
  Item.list(function(items) {
    res.json(items);
  }, function(err) {
    res.status(400).json(err);
  });
});


// add
router.post('/items', function(req, res) {
  Item.save(req.body.name, function(item) {
    res.status(201).json(item);
  }, function(err) {
    res.status(400).json(err);
  });
});

// Update
router.put('/items/:id', function(req, res) {
  Item.update(req.params.id, req.body.name, function(item) {
    res.status(200).json(item);
  }, function(err) {
    res.status(400).json(err);
  });
});

// Delete items
router.delete('/items/:id', function(req, res) {
  Item.remove(req.params.id, function(item) {
    res.status(200).json(item);
  }, function(err) {
    res.status(500).json(err);
  });
});

module.exports = router;