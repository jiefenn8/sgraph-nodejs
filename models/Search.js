var neo4j = require("../neo4j.js");
var common = require("../common.js");

function getJSONResponse(key, depth) {
  var keyword = key;
  var query =
    "MATCH (s:Resource)-[r]-(o)\
  WHERE s.name =~ {keyword}\
  WITH s, {rel: type(r), name: o.name} AS child\
  WITH s, {name: s.name, children: collect(child)} AS result\
  WITH count(DISTINCT s) as result_count, collect(DISTINCT result)[0..{limit}] as results\
  RETURN result_count, results";

  var graph = neo4j.getQueryResults(
    query,
    keyword,
    0,
    0,
    10,
    common.generateJSON
  );
  return graph;
}

exports.getJSONResponse = getJSONResponse;
