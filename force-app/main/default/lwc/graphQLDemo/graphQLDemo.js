import { LightningElement, track, wire } from 'lwc';

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

    @track cursorMap = {};

    selectedRow;

    handleRowSelection(e) {
        const { selectedRows } = e.detail;
        this.selectedRow = selectedRows.length ? selectedRows[0] : null;
    }

    handleSearchKeyChange(e) {
        this.resetCursorStacks();
        this.searchKey = e.detail.value;
    }

    handleActiveTab(e) {
        this.activeTabKey = e.target.value;
    }

    handlePageChange(e) {
        const { cursor, tabValue } = e.detail;
        this.cursorMap[tabValue] = cursor;
        this.isLoading = true;
    }

    handleGQLResult(e) {
        console.log('handling gql result');
        const { errors, data } = e.detail.result;
        this.errors = errors;
        if (data) {
            this.tabs = flattenQueryResult(data.uiapi.query, {}, columnsMapping);
        }
        console.log('done handling');
    }

    refresh() {
        this.refs.query.refresh();
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

    resetCursorStacks() {
        this.cursorMap = {};
        this.refs.tabset.resetCursorStacks();
    }

}
