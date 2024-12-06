import { LightningElement, api } from 'lwc';

export default class GqlChildDetails extends LightningElement {
    @api gqlRecord;
    @api titleField = 'Name';

    connectedCallback() {
        console.log('the record: ' + JSON.stringify(this.gqlRecord));
    }

    get title() { 
        return this.gqlRecord[this.titleField];
    }

    get tabs() {
        return Object.keys(this.gqlRecord)
            .filter(key => this.gqlRecord[key] && typeof this.gqlRecord[key] === 'object' && Object.prototype.hasOwnProperty.call(this.gqlRecord[key], 'records'))
            .map(key => this.gqlRecord[key]);
    }
}