var express = require('express');
var searchRouter = express.Router();

var neo4jdao = require('../neo4j-adapter.js');

/* GET graph data. */
searchRouter.get('/:id', function(req, res) {
    var data = neo4jdao.getGraphv2(req.params.id);
    data.then(function(data){
        res.json(data);
    });

});

module.exports = searchRouter;
