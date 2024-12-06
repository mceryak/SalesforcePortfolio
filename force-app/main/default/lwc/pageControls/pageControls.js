import { LightningElement, api, track } from 'lwc';

export default class PageControls extends LightningElement {

    @api cursor;
    @api cursorId;
    @api pageSize = 10;
    @api total;

    @track
    _cursorStack = []

    @api resetCursorStack() {
        this._cursorStack = [];
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
        this._dispatchCursorChangeEvent();
    }

    _dispatchCursorChangeEvent() {
        this.dispatchEvent(new CustomEvent('cursorchange', { detail: { cursorId: this.cursorId, cursor: this._cursorStack.at(-1) }}));
    }

}