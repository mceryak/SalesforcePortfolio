import { LightningElement, wire, api } from 'lwc';
import { gql, graphql, refreshGraphQL } from 'lightning/uiGraphQLApi';
import { shallowEqual } from 'c/graphQLUtils';

export default class GqlDemoQuery extends LightningElement {

    isLoading = false;
    gqlResult;

    @wire(graphql, {
        query: '$accContactTestQuery',
        variables: '$variables'
    }) processGQLResult(result) {
        console.log('done with query');
        this.isLoading = false;
        this.gqlResult = result;
        this.dispatchEvent(new CustomEvent('gqlresult', { detail: { result }}));
    }

    _variables = {};
    @api 
    get variables() { return this._variables; }
    set variables(val) {
        if (shallowEqual(val, this._variables)) { return; }
        console.log('set vars');
        this.isLoading = val.searchKey === this._variables.searchKey; // if searching in real-time, don't disrupt with spinner
        this._variables = val;
    }

    @api async refresh() {
        this.isLoading = true;
        try {
            await refreshGraphQL(this.gqlResult);
        } catch (err) {
            console.log(JSON.stringify(err));
            // this.errors = err;
        } finally {
            this.isLoading = false;
        }
    }

    get accContactTestQuery() {
        return gql`
        query Accounts($searchKey: String!, $first: Int, $accountCursor: String, $contactCursor: String, $testObjectCursor: String) {
            uiapi {
                query {
                    Account(
                        first: $first
                        after: $accountCursor
                        where: { Name: { like: $searchKey } }
                    ) {
                        edges {
                            node {
                                ApiName
                                Id
                                Rating { value }
                                Name { value }
                                AccountSource { value }
                                Active__c { value }
                                Owner {
                                    Name { value }
                                }
                                Contacts {
                                    edges {
                                        node {
                                            Id
                                            Name { value }
                                            Owner {
                                                Name {
                                                    value
                                                }
                                            }
                                        }
                                    }
                                    totalCount
                                    pageInfo {
                                        endCursor
                                        hasNextPage
                                    }
                                }
                                Opportunities {
                                    edges {
                                        node {
                                            ApiName
                                            Id
                                            Name { value }
                                            ExpectedRevenue { format }
                                            Amount { format }
                                        }
                                    }
                                    totalCount
                                    pageInfo {
                                        endCursor
                                        hasNextPage
                                    }
                                }
                            }
                        }
                        totalCount
                        pageInfo {
                            endCursor
                            hasNextPage
                        }
                    }
                    Contact(
                        first: $first
                        after: $contactCursor
                        where: { Name: { like: $searchKey } }
                    ) {
                        edges {
                            node {
                                ApiName
                                Id
                                Name { value }
                            }
                        }
                        totalCount
                        pageInfo {
                            endCursor
                            hasNextPage
                        }
                    }
                    TestObject__c(
                        first: $first
                        after: $testObjectCursor
                        where: { Name: { like: $searchKey } }
                    ) {
                        edges {
                            node {
                                Id
                                ApiName
                                Name { value }
                                Account__r {
                                    Name { value }
                                }
                            }
                        }
                        totalCount
                        pageInfo {
                            endCursor
                            hasNextPage
                        }
                    }
                }
            }
        }`;
    }

}