
// const getPaginationInfo = function(queryResult, curPaginationInfo) {
//     return Object.keys(queryResult).reduce((acc, key) => {
//         return Object.assign(acc, {
//             [key]: {
//                 total: queryResult[key].totalCount,
//                 cursorStack: curPaginationInfo ? curPaginationInfo[key]?.cursorStack ?? [] : [],
//                 endCursor: queryResult[key].pageInfo.endCursor,
//                 cursorId: key
//             }
//         });
//     }, {});
// }

// export { getPaginationInfo }; 

// // const flattenNode = function(node, key) {

// //     return Object.keys(node).filter(key => node[key].pageInfo).reduce((acc, key) => {
// //         Object.assign(acc, {
// //             total: node[key].totalCount,
// //             pageInfo: node[key].pageInfo,
// //             cursorStack: [node[key].pageInfo?.endCursor]
// //         }, Object.keys(node[key]).reduce()
// //     }, {})

// //     const key = keyPrefix + curField;
// //     const flattenTo = flattenToMapping[curField] ?? 'value';

// //     // catch Id field or any potential field that doesn't have sub-selections
// //     if (typeof node !== 'object') {
// //         return { [key]: node }
// //     }

// //     // check if we are at leaf node
// //     if (Object.prototype.hasOwnProperty.call(node, flattenTo)) {
// //         return { [key]: node[flattenTo] };
// //     }

// //     // check if this node is a child relationship
// //     if (Object.prototype.hasOwnProperty.call(node, 'edges')) { 
// //         return { [key]: {
// //             records: node.edges.map(edge => flattenNode(edge.node, '', '', flattenToMapping)),
// //             total: node.totalCount,
// //             pageInfo: node.pageInfo
// //         }
// //         }; // reset keyPrefix for child object
// //     }

// //     // node must be a parent relationship, so parse all the returned fields of the parent
// //     return Object.keys(node).reduce((acc, subKey) => {
// //         return Object.assign(acc, flattenNode(node[subKey], key, subKey, flattenToMapping)); // new keyPrefix becomes a concatenation of the field hierarchy (e.g. node.AccountOwnerName)
// //     }, {});
// // }

// // // flattenToMapping ex: { Name: 'value', Amount: 'format' }
// // // - maps the field name to the leaf ValueType
// // const flattenQueryResult = function(queryResult, flattenToMapping) {
// //     return flattenNode(queryResult, '', '', flattenToMapping);
// // }