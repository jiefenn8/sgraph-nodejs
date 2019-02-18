var neo4j = require("neo4j-driver").v1;
var driver = neo4j.driver(
  "bolt://192.168.1.13",
  neo4j.auth.basic("neo4j", "1234")
);

function getQueryResults(query, keyword, depth, skip, limit, callback) {
  var session = driver.session();
  return session
    .run(query, {
      skip: skip,
      limit: limit,
      keyword: "(?i).*" + keyword + ".*"
    })
    .then(queryResponse => {
      session.close();
      return callback(queryResponse);
    });
}

exports.getQueryResults = getQueryResults;
