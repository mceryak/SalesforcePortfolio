import { LightningElement, wire } from 'lwc';
import { graphql, gql, refreshGraphQL } from 'lightning/uiGraphQLApi';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import NO_OF_LOCATIONS_FIELD from '@salesforce/schema/Account.NumberofLocations__c';
import { flattenQueryResult } from 'c/graphqlutils/mapaccounts';

const pageSize = 5;
const DELAY = 300;
export default class Graphqlcmp extends LightningElement {

    nameSearchKey = '';
    pageInfo;
    after;
    cursorStack = [];
    graphQLResult;
    errors;
    accounts;
    isLoading = false;
    selectedAccountId;
    pageNumber = 1;

    get errorMsg() { return this.errors ? JSON.stringify(this.errors) : null; }

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'No. of Locations', fieldName: 'NumberofLocations__c' }
    ];
    fields = [NAME_FIELD, NO_OF_LOCATIONS_FIELD];

    get query() {
        return gql`
        query searchAccounts($name: String!, $pageSize: Int = 5, $accountCursor: String, $contactCursor: String) {
            uiapi {
                query {
                    Account(
                        where: { Name: { like: $name } }
                        first: $pageSize
                        after: $accountCursor
                        orderBy: { Name: { order: ASC } }
                    ) {
                        edges {
                            node {
                                Id
                                Name { value }
                                NumberofLocations__c { value }
                                Owner { # child-to-parent relationship
                                    Name { value }
                                }
                                #Contacts { # parent-to-child relationship
                                #    edges {
                                #        node {
                                #            Name { value }
                                #        }
                                #    }
                                #}
                            }
                        }
                        pageInfo {
                            startCursor
                            endCursor
                            hasNextPage
                            hasPreviousPage
                        }
                        totalCount
                        pageResultCount
                    }
                    Contact(
                        where: { Name: { like: $name } }
                        first: $pageSize
                        after: $contactCursor
                        orderBy: { Name: { order: ASC } }
                    ) { 
                        edges {
                            node {
                                Name { value }
                                Account { Name { value } }
                            }
                        }
                    }
                }
            }
        }
        `
    }

    @wire(graphql, {
        query: '$query',
        variables: '$variables'
    }) wiredResult(result) {
        this.isLoading = false;
        this.graphQLResult = result;
        const { errors, data } = result; 
        if (errors) {
            this.errors = errors;
        }
        if (data) {
            this.pageInfo = data.uiapi.query.Account.pageInfo;
            this.accounts = flattenQueryResult(data.uiapi.query);
        }
    }

    get variables() {
        return {
            name: this.nameSearchKey === '' ? '%' : `%${this.nameSearchKey}%`,
            pageSize: pageSize,
            after: this.after
        };
    }

    get didFindAccounts() { return this.accounts && this.accounts.length > 0; }
    get selectedRows() { return this.selectedAccountId ? [this.selectedAccountId] : []; }
    get currentPageNumber() { return this.totalCount === 0 ? 0 : this.pageNumber; }
    get isFirstPage() { return !this.pageInfo?.hasPreviousPage; }
    get isLastPage() { return !this.pageInfo?.hasNextPage; }
    get totalCount() { return this.graphQLResult?.data?.uiapi.query.Account.totalCount || 0; }
    get totalPages() { return Math.ceil(this.totalCount / pageSize); }

    onSelectRow(e) {
        const selectedRows = e.detail.selectedRows;
        this.selectedAccountId = selectedRows.length > 0 ? selectedRows[0].Id : null;
    }

    handleSearchKeyChange(e) {
        window.clearTimeout(this.delayTimeout);
        const searchKey = e.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            // this.graphQLResult = null;
            this.nameSearchKey = searchKey;
            this.after = null;
            this.cursorStack = [];
            this.pageNumber = 1;
        }, DELAY);
    }

    async refresh() {
        this.isLoading = true;
        try {
            await refreshGraphQL(this.graphQLResult);
        } catch (e) {
            this.errors = e;
        } finally {
            this.isLoading = false;
        }
    }

    handleNext() {
        const { hasNextPage, endCursor } = this.pageInfo;
        if (hasNextPage) {
            this.cursorStack.push(this.after);
            this.after = endCursor;
            this.pageNumber++;
        }
    }
    handlePrevious() {
        this.after = this.cursorStack.pop() ?? null;
        this.pageNumber = Math.max(0, this.pageNumber - 1);
    }

    

}