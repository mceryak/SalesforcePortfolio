




// const parseNode = function(node) {
//     if (Object.prototype.hasOwnProperty.call(node, 'edges')) {
//         return node.edges.map(
//             edge => 
//                 Object.keys(edge.node).reduce(
//                     (acc, key) => 
//                         Object.assign(acc, { [key]: parseNode(edge.node[key]) }), 
//                     {}
//                 )
//         );
//     }
//     return node;
// }

const flattenNode = function(node, keyPrefix='', curField='', flattenToMapping={}) {
    const key = keyPrefix + curField;
    const flattenTo = flattenToMapping[curField] ?? 'value';

    // catch Id field or any potential field that doesn't have sub-selections
    if (typeof node !== 'object') {
        return { [key]: node }
    }

    // check if we are at leaf node
    if (Object.prototype.hasOwnProperty.call(node, flattenTo)) {
        return { [key]: node[flattenTo] };
    }

    // check if this node is a child relationship
    if (Object.prototype.hasOwnProperty.call(node, 'edges')) { 
        return { [key]: node.edges.map(edge => flattenNode(edge.node, '', '', flattenToMapping))}; // reset keyPrefix for child object
    }

    // node must be a parent relationship, so parse all the returned fields of the parent
    return Object.keys(node).reduce((acc, subKey) => {
        return Object.assign(acc, flattenNode(node[subKey], key, subKey, flattenToMapping)); // new keyPrefix becomes a concatenation of the field hierarchy (e.g. node.AccountOwnerName)
    }, {});
}

// flattenToMapping ex: { Name: 'value', Amount: 'format' }
// - maps the field name to the leaf ValueType
const flattenQueryResult = function(queryResult, flattenToMapping) {
    return flattenNode(queryResult, '', '', flattenToMapping);
}

// const parseQueryResult = function(queryResult) {
//     // for each object queried
//     return Object.keys(queryResult).reduce((acc, key) => {
//         // parse the results for that object
//         return Object.assign(acc, { [key]: parseNode(queryResult[key], key) })
//     }, {})
// };

export { flattenQueryResult };