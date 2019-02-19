var express = require("express");
var search_router = express.Router();
var search = require("../../models/Search.js");

/* GET graph data. */
search_router.get("/:id", function(req, res) {
  var start = req.query.start;
  var limit = req.query.limit;
  var depth = req.query.depth;
  var data = search.getJSONResponse(req.params.id, start, limit, depth);
  data.then(function(data) {
    res.json(data);
  });
});

module.exports = search_router;
