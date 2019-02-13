var _ = require("lodash");
var neo4j = require("../neo4j.js");

//Todo: Add depth function to return detailed graph
//Todo: Decouple functions and files for refactoring
function getJSONResponse(key, depth) {
  var keyword = key;
  var query =
    "MATCH (s0:Resource)-[r1]-(s1:Resource) \
                WHERE s0.name =~ {keyword}\
                WITH s0, {rel: type(r1), name: s1.name} AS scName \
                WITH {name: s0.name, childs: collect(scName)} AS subject \
                RETURN {resources: collect(subject)[..{limit}]} AS result";

  var graph = neo4j.getQueryResults(query, keyword, 0, transverse);
  return graph;
}

function appendToResponse(prev, obj, nodes, rels) {
  //Set group to id main nodes
  var object;
  if (obj.rel !== undefined) {
    object = { id: obj.name, group: 1 };
  } else {
    object = { id: obj.name, group: 0 };
  }

  //If object does not exist in nodes, add it
  var objExists = _.findIndex(nodes, object);
  if (objExists == -1) {
    nodes.push(object);
  }

  if (prev.name !== object.id) {
    rels.push({
      source: prev.name,
      target: object.id,
      rel: obj.rel,
      value: 1
    });
  }
}

//Using Breadth First Search Traversal algorithm
function transverse(resource, nodes, rels) {
  var queue = [],
    prev = resource,
    next = resource;
  while (next) {
    if (next.parent !== undefined) {
      prev = next.parent;
      next = queue.shift();
    }

    appendToResponse(prev, next, nodes, rels);

    if (next.childs !== undefined) {
      queue.push({ parent: next });
      next.childs.forEach(child => {
        queue.push(child);
      });
    }
    next = queue.shift();
  }
}

exports.getJSONResponse = getJSONResponse;
