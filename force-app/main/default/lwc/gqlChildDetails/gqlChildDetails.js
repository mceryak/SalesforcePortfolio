import { LightningElement, api } from 'lwc';

export default class GqlChildDetails extends LightningElement {
    @api gqlRecord;
    @api titleField = 'Name';

    get title() {
        return this.gqlRecord ? this.gqlRecord[this.titleField] : '<--- Select a Record';
    }

}