import { LightningElement, api } from 'lwc';

export default class GqlDemoTableTab extends LightningElement {

    @api tab;
    @api pageSize = 10;
    @api maxRowSelection = 0;
    
    handleCursorChange(e) {
        const { cursor } = e.detail;
        this.dispatchEvent(new CustomEvent('pagechange', { detail: { cursor, tabValue: this.tab.tabValue }}));
    }
    
    handleRowSelection(e) {
        const { selectedRows } = e.detail;
        this.dispatchEvent(new CustomEvent('rowselection', { detail: { selectedRows }}));
    }

    @api resetCursorStack() {
        this.refs.pagecontrols.resetCursorStack();
    }

}