import { LightningElement, api } from 'lwc';

export default class GqlChildDetails extends LightningElement {
    @api gqlRecord;
    @api titleField = 'Name';

    get title() { return this.gqlRecord[this.titleField]; }

    get tabs() {
        return Object.keys(this.gqlRecord)
            .filter(key => Object.prototype.hasOwnProperty.call(this.gqlRecord[key], 'records'))
            .map(key => this.gqlRecord[key]);
    }
}