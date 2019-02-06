var _ = require('lodash');
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://192.168.1.13", neo4j.auth.basic("neo4j", "1234"));

function getGraphv2(key) {
    var session = driver.session();

    var query = 'MATCH (s0:Resource)-[r1]-(s1:Resource)-[r2]-(s2:Resource) \
                WHERE s0.name =~ {key}\
                WITH s0, {rel: type(r1), name: s1.name} AS scName \
                WITH {name: s0.name, childs: collect(scName)} AS subject \
                RETURN {resources: collect(subject)[..{limit}]} AS result';

    return session.run(
        query, {limit: 20, key: '(?i).*' + key + '.*'})
        .then(results => {
            session.close();
            var nodes = [], rels = [], id = 0;
            //For each result entry
            results.records.forEach(res => {

                var result = res.get('result');
                var resources = result.resources;
                for(var i = 0, n = resources.length; i < n; i++){
                    bfsTransverse(resources[i], nodes, rels, addToJsonResponse);
                }
            });
            return {nodes, links: rels};
        })
}

function addToJsonResponse(prev, obj, nodes, rels){
    var object, prevIndex, target;

    //Assume as root of a graph(s)
    if(obj.rel !== undefined){object = {name: obj.name, group: 1}}
    else{object = {name: obj.name, group: 0}}

    target = {name: prev.name};

    //Find source, if not exist. Add it
    var source = _.findIndex(nodes, object);
    if(source == -1){
        nodes.push(object);
        source = _.findIndex(nodes, object);
    }

    prevIndex = _.findIndex(nodes, target);

    rels.push({source: source, target: prevIndex, rel: obj.rel, value: 1});
}

function bfsTransverse(obj, nodes, rels, cb){
    var queue = [], prev = obj, next = obj;
    while(next){
        if(next.parent !== undefined) {
            prev = next.parent;
            next = queue.shift();
        }

        cb(prev, next, nodes, rels);
        if(next.childs !== undefined){
            queue.push({parent: next});
            next.childs.forEach(child => {
                queue.push(child);
            })
        }
        next = queue.shift();
    }
}

exports.getGraphv2 = getGraphv2;