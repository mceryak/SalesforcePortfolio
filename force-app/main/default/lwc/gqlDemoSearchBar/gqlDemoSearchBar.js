import { LightningElement } from 'lwc';

export default class GqlDemoSearchBar extends LightningElement {

    searchKey = '';
    timer;
    
    handleSearchKeyChange(e) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        const func = () => {
            this.dispatchEvent(new CustomEvent('searchkeychange', { detail: { value: e.detail.value }}));
        };
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.timer = setTimeout(func.apply(this), 1000);
    }

    refresh() {
        this.dispatchEvent(new CustomEvent('refresh'));
    }

}