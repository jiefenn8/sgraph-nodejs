var neo4j = require("neo4j-driver").v1;
var driver = neo4j.driver(
  "bolt://192.168.1.13",
  neo4j.auth.basic("neo4j", "1234")
);

function getQueryResults(query, keyword, depth, callback) {
  var session = driver.session();
  return session
    .run(query, { limit: 10, keyword: "(?i).*" + keyword + ".*" })
    .then(results => {
      session.close();
      var nodes = [],
        rels = [];
      //For each result entry
      results.records.forEach(res => {
        var result = res.get("result");
        var resources = result.resources;
        for (var i = 0, n = resources.length; i < n; i++) {
          callback(resources[i], nodes, rels);
        }
      });
      return { nodes: nodes, links: rels };
    });
}

exports.getQueryResults = getQueryResults;
