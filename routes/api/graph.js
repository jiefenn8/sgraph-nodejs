var express = require("express");
var graph_router = express.Router();
var graph = require("../../models/Graph.js");

/* GET graph data. */
graph_router.get("/", function(req, res, next) {
  var data = graph.getJSONResponse("customer", 0); //Todo: get list of graphs available instead
  data.then(function(data) {
    res.json(data);
  });
});

module.exports = graph_router;
