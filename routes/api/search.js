var express = require("express");
var search_router = express.Router();
var neo4j = require("../../models/Search.js");

/* GET graph data. */
search_router.get("/:id", function(req, res) {
  var data = neo4j.getJSONResponse(req.params.id, 1);
  data.then(function(data) {
    res.json(data);
  });
});

module.exports = search_router;
