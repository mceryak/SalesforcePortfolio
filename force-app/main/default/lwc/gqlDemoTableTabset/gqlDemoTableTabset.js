import { LightningElement, api } from 'lwc';

export default class GqlDemoTableTabset extends LightningElement {

    @api tabs;
    @api pageSize = 10;
    @api maxRowSelection = 0;

    handlePageChange(e) {
        this.dispatchEvent(new CustomEvent('pagechange', { detail: e.detail }));
    }
    
    handleRowSelection(e) {
        this.dispatchEvent(new CustomEvent('rowselection', { detail: e.detail}));
    }

    @api resetCursorStacks() {
        const tabElems = this.template.querySelectorAll('c-gql-demo-table-tab');
        tabElems.forEach(elem => elem.resetCursorStack());
    }

}