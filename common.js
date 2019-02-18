var _ = require("lodash");

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
function transverse(result, nodes, rels) {
  var queue = [],
    prev = result,
    next = result;
  while (next) {
    if (next.parent !== undefined) {
      prev = next.parent;
      next = queue.shift();
    }

    appendToResponse(prev, next, nodes, rels);

    if (next.children !== undefined) {
      queue.push({ parent: next });
      next.children.forEach(child => {
        queue.push(child);
      });
    }
    next = queue.shift();
  }
}

function generateJSON(queryResponse) {
  var nodes = [],
    rels = [];
  //currently expect only one record from a single query
  var result = queryResponse.records[0].get("results");
  for (var i = 0, n = result.length; i < n; i++) {
    transverse(result[i], nodes, rels);
  }
  return { nodes: nodes, links: rels };
}

exports.appendToResponse = appendToResponse;
exports.transverse = transverse;
exports.generateJSON = generateJSON;
