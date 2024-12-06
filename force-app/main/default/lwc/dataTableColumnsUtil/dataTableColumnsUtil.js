import accountColumns from "./accountColumns";
import contactColumns from "./contactColumns";  
import oppColumns from "./oppColumns";
import testObjectColumns from "./testObjectColumns";


const columnsMapping = {
    'Account': accountColumns,
    'Opportunities': oppColumns,
    'Contact': contactColumns,
    'Contacts': contactColumns,
    'TestObject__c': testObjectColumns
}

export { columnsMapping };