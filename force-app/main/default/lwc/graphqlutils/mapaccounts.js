

// data.mapToSObjects()
//      .withSubquery

const mapGraphQLDataToSObjects = function(node, queryName, fieldApiNames) {
    // return { Id: node.Id, ...fieldApiNames.map((f) => {
    //     const split = f.split('.').reduce({}, (acc, val) => ({ [val]:  }))
    //     let x = {};
    //     for (let i = 0; i < split.length; i++) {
    //         x[]
    //     }
    // } }
    return graphQLData.uiapi.query[queryName].edges.map((edge) => 
            
    );
};

const mapNode = function(node, fieldApiNames) {
    return { 
        Id: node.Id,
        ...fieldApiNames.map((f) => ({ 
            [f.replaceAll('.', '')]: f.split('.').reduce((acc, key) => acc[key], node).value
        })) 
    };
} 

export { mapAccounts };