import accountColumns from "./accountColumns";
import contactColumns from "./contactColumns";  
import testObjectColumns from "./testObjectColumns";


const columnsMapping = {
    'Account': accountColumns,
    'Contact': contactColumns,
    'TestObject__c': testObjectColumns
}

export { columnsMapping };