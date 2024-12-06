import { LightningElement, track, wire } from 'lwc';
import { gql, graphql, refreshGraphQL } from 'lightning/uiGraphQLApi';
import { flattenQueryResult } from 'c/graphQLUtils';
import { columnsMapping } from 'c/dataTableColumnsUtil';

export default class GraphQLDemo extends LightningElement {

    isLoading = true;
    pageSize = 10;

    searchKey = '';

    gqlResult;
    tabs = [];
    errors;
    get errorMsg() { return this.errors?.map(err => err.message); }
    activeTabKey = 'Account';

    @track cursorMap = {};

    timer;
    handleSearchKeyChange(e) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        const func = () => {
            this.resetCursorStacks();
            this.searchKey = e.detail.value;
        };
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.timer = setTimeout(func.apply(this), 1000);
    }

    handleActiveTab(e) {
        this.activeTabKey = e.target.value;
    }

    async refresh(e) {
        this.isLoading = true;
        this.resetCursorStacks();
        try {
            await refreshGraphQL(this.gqlResult);
        } catch (e) {
            this.errors = e;
        } finally {
            this.isLoading = false;
        }
    }

    resetCursorStacks() {
        this.cursorMap = {};
        const elems = this.template.querySelectorAll('c-page-controls');
        console.log('elems length: ' + elems.length);
        elems.forEach(elem => {
            elem.resetCursorStack();
        })
    }

    @wire(graphql, {
        query: '$accContactTestQuery',
        variables: '$variables'
    }) processGQLResult(result) {
        this.isLoading = false;
        this.gqlResult = result;
        const { errors, data } = result;
        this.errors = errors;
        if (data) {
            console.log(JSON.stringify(data));
            this.tabs = flattenQueryResult(data.uiapi.query, {}, columnsMapping);
            console.log(JSON.stringify(this.tabs));
        }
    }

    get variables() {
        return { 
            searchKey: this.searchKey === '' ? '%' : `%${this.searchKey}%`,
            first: this.pageSize,
            accountCursor: this.cursorMap.Account,
            contactCursor: this.cursorMap.Contact,
            testObjectCursor: this.cursorMap.TestObject__c,
        };
    }

    handleCursorChange(e) {
        const { cursor, cursorId } = e.detail;
        this.cursorMap[cursorId] = cursor;
        this.isLoading = true;
    }

    selectedRow;
    handleRowSelection(e) {
        const { selectedRows } = e.detail;
        this.selectedRow = selectedRows.length ? selectedRows[0] : null;
    }

    get accContactTestQuery() {
        return gql`
        query Accounts($searchKey: String!, $first: Int=10, $accountCursor: String, $contactCursor: String, $testObjectCursor: String) {
            uiapi {
                query {
                    Account(
                        first: $first
                        after: $accountCursor
                        where: { Name: { like: $searchKey } }
                    ) {
                        edges {
                            node {
                                Id
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


/*

Topics
- about the wire adaptor
    - shared caching managed by LDS
    - works with uiapi, so object and fls is taken care of
- when to use
    - optimize queries fetching data for multiple objects
    - pagination for large data sets
    - ALTERNATIVES: 
        - LDS
        - uiapi
        - apex
- limitations
    - dynamic query construction
    - string interpolation in query
    - 

- query
- aggregate
- search key variable
    - vars can't be used to pass the name of objects or fields
- delay query (select record)
- aliasing


1. Get Opportunity Name (first 10)
    a. Get Revenue
    b. Get Parent Account Name
    c. Get Parent Account Owner Name

2. 


*/