const leafNodeFields = ['format', 'displayValue', 'value'];

const flattenNode = function(node, keyPrefix='', curField='', flattenToMapping={}, columnsMapping={}) {
    const key = keyPrefix + curField;

    // catch Id field or any potential field that doesn't have sub-selections
    if (!node || typeof node !== 'object') {
        return { [key]: node }
    }

    // check if we are at leaf node
    // if (Object.prototype.hasOwnProperty.call(node, flattenTo)) {
        if (Object.keys(node).some(k => leafNodeFields.includes(k))) {
        return { [key]: node[flattenToMapping[curField]] ?? leafNodeFields.reduce((acc, f) => acc ?? node[f], null) };
    }

    // check if this node is a child relationship
    if (Object.prototype.hasOwnProperty.call(node, 'edges')) { 
        return { [key]: {
            records: node.edges.map(edge => flattenNode(edge.node, '', '', flattenToMapping, columnsMapping)),
            total: node.totalCount,
            // pageInfo: node.pageInfo,
            cursor: node.pageInfo?.endCursor,
            tabLabel: `${key} (${node.totalCount ?? ''})`,
            tabValue: key,
            columns: columnsMapping[key] ?? []
        }
        }; // reset keyPrefix for child object
    }

    // node must be a parent relationship, so parse all the returned fields of the parent
    return Object.keys(node).reduce((acc, subKey) => {
        return Object.assign(acc, flattenNode(node[subKey], key, subKey, flattenToMapping, columnsMapping)); // new keyPrefix becomes a concatenation of the field hierarchy (e.g. node.AccountOwnerName)
    }, {});
}

// flattenToMapping ex: { Name: 'value', Amount: 'format' }
// - maps the field name to the leaf ValueType
const flattenQueryResult = function(queryResult, flattenToMapping, columnsMapping) {
    const objResult = flattenNode(queryResult, '', '', flattenToMapping, columnsMapping);
    return Object.keys(objResult).map(key => objResult[key])
}

export { flattenQueryResult };