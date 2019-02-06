var express = require('express');
var graphRouter = express.Router();
var cors = require('cors');
var neo4jdao = require('../neo4j-adapter.js');

/* GET graph data. */
graphRouter.get('/', cors(), function(req, res, next) {
    var data = neo4jdao.getGraphv2('customer');
    data.then(function(data){
        res.json(data);
    });
});

module.exports = graphRouter;
