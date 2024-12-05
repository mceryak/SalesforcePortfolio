import { LightningElement, api, track } from 'lwc';

const PageChange = Object.freeze({
    NEXT: -1,
    BACK: -3
});
export default class PageControls extends LightningElement {


    // TODO: implement pagination

    @api cursor;
    @api cursorId;
    @api pageSize = 10;
    @api total;

    @track
    _cursorStack = []

    connectedCallback() {
        console.log('cursor stack for ' + this.cursorId + ' = ' + JSON.stringify(this._cursorStack));
    }

    get curPage() { return (this._cursorStack.length) + 1; }
    get totalPages() { return Math.max(1, Math.ceil(this.total / this.pageSize)); }
    get hasNext() { return this.curPage < this.totalPages; }
    get hasPrevious() { return this.curPage > 1; }
    get isFirstPage() { return !this.hasPrevious; }
    get isLastPage() { return !this.hasNext; }

    handlePrevious(e) {
        if (this._cursorStack.pop()) {
            this._dispatchCursorChangeEvent();
        }
    }

    handleNext(e) {
        this._cursorStack.push(this.cursor);
        console.log('cursor stack for ' + this.cursorId + ' = ' + JSON.stringify(this._cursorStack));
        this._dispatchCursorChangeEvent();
    }

    _dispatchCursorChangeEvent() {
        this.dispatchEvent(new CustomEvent('cursorchange', { detail: { cursorId: this.cursorId, cursor: this._cursorStack.at(-1) }}));
    }

}