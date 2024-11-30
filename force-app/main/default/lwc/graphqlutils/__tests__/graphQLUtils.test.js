import { flattenQueryResult } from "../mapaccounts";

describe('c-graph-ql-utils', () => {
    
    it('tests simple gql query with flattenQueryResult()', () => {
        const json = '{"uiapi":{"query":{"Account":{"edges":[{"node":{"Id":"001ak00000MoLURAA3","Name":{"value":"Edge Communications"}}},{"node":{"Id":"001ak00000MoLUSAA3","Name":{"value":"Burlington Textiles Corp of America"}}},{"node":{"Id":"001ak00000MoLUTAA3","Name":{"value":"Pyramid Construction Inc."}}},{"node":{"Id":"001ak00000MoLUUAA3","Name":{"value":"Dickenson plc"}}},{"node":{"Id":"001ak00000MoLUVAA3","Name":{"value":"Grand Hotels & Resorts Ltd"}}},{"node":{"Id":"001ak00000MoLUWAA3","Name":{"value":"United Oil & Gas Corp."}}},{"node":{"Id":"001ak00000MoLUXAA3","Name":{"value":"Express Logistics and Transport"}}},{"node":{"Id":"001ak00000MoLUYAA3","Name":{"value":"University of Arizona"}}},{"node":{"Id":"001ak00000MoLUZAA3","Name":{"value":"United Oil & Gas, UK"}}},{"node":{"Id":"001ak00000MoLUaAAN","Name":{"value":"United Oil & Gas, Singapore"}}}]}}}}';
        const gqlResult = JSON.parse(json);

        const res = flattenQueryResult(gqlResult.uiapi.query);
        
        expect(res).toBeDefined();
        expect(res.Account[0].Id).toBe('001ak00000MoLURAA3');
        expect(res.Account[0].Name).toBe('Edge Communications');
    });

    it('tests flattenTo, parent/child relationships, multiple objects, polymorphic relations with flattenQueryResult()', () => {
        const json = '{"data":{"uiapi":{"query":{"Opportunity":{"edges":[{"node":{"Amount":{"value":15000.0,"format":"$15,000.00"},"StageName":{"value":"Qualification","displayValue":"Qualification"}}}]},"Account":{"edges":[{"node":{"Id":"001aj00000iCo3CAAS","Name":{"value":"Edge Communications"},"Parent":{"Id":"001aj00000iKbFdAAK","ApiName":"Account","Name":{"value":"Trailblazer Express"},"Owner":{"ApiName":"User","Name":{"value":"Gandalf Stormcrow"}}},"Contacts":{"edges":[{"node":{"Name":{"value":"Rose Gonzalez"},"Owner":{"Name":{"value":"Gandalf Stormcrow"}}}},{"node":{"Name":{"value":"Sean Forbes"},"Owner":{"Name":{"value":"Gandalf Stormcrow"}}}}]}}}]},"Case":{"edges":[{"node":{"Owner":{"ApiName":"User","Username":{"value":"gstormcrow@youshallnotpass.com"}}}},{"node":{"Owner":{"ApiName":"Group","DeveloperName":{"value":"Case_Queue"}}}}]}}}},"errors":[]}';
        const gqlResult = JSON.parse(json);

        const res = flattenQueryResult(gqlResult.data.uiapi.query, { StageName: 'displayValue', Amount: 'format' });
        
        expect(res).toBeDefined();

        expect(res.Opportunity.length).toBe(1);
        expect(res.Opportunity[0].Amount).toBe('$15,000.00');
        expect(res.Opportunity[0].StageName).toBe('Qualification');

        expect(res.Account[0].Id).toBe('001aj00000iCo3CAAS');
        expect(res.Account[0].Name).toBe('Edge Communications');
        expect(res.Account[0].ParentName).toBe('Trailblazer Express');
        expect(res.Account[0].ParentId).toBe('001aj00000iKbFdAAK');
        expect(res.Account[0].ParentApiName).toBe('Account');
        expect(res.Account[0].ParentOwnerName).toBe('Gandalf Stormcrow');
        expect(res.Account[0].ParentOwnerApiName).toBe('User');
        expect(res.Account[0].Contacts.length).toBe(2);
        expect(res.Account[0].Contacts[0].Name).toBe('Rose Gonzalez');
        expect(res.Account[0].Contacts[0].OwnerName).toBe('Gandalf Stormcrow');
        expect(res.Account[0].Contacts[1].Name).toBe('Sean Forbes');
        expect(res.Account[0].Contacts[1].OwnerName).toBe('Gandalf Stormcrow');

        expect(res.Case.length).toBe(2);
        expect(res.Case[0].OwnerUsername).toBe('gstormcrow@youshallnotpass.com');
        expect(res.Case[0].OwnerApiName).toBe('User');
        expect(res.Case[0].OwnerDeveloperName).toBeUndefined();
        expect(res.Case[1].OwnerUsername).toBeUndefined();
        expect(res.Case[1].OwnerDeveloperName).toBe('Case_Queue');
        expect(res.Case[1].OwnerApiName).toBe('Group');
    });

    // it('tests the parsing of simple gql query results with datatablemode OFF', () => {
    //     const json = '{"uiapi":{"query":{"Account":{"edges":[{"node":{"Id":"001ak00000MoLURAA3","Name":{"value":"Edge Communications"}}},{"node":{"Id":"001ak00000MoLUSAA3","Name":{"value":"Burlington Textiles Corp of America"}}},{"node":{"Id":"001ak00000MoLUTAA3","Name":{"value":"Pyramid Construction Inc."}}},{"node":{"Id":"001ak00000MoLUUAA3","Name":{"value":"Dickenson plc"}}},{"node":{"Id":"001ak00000MoLUVAA3","Name":{"value":"Grand Hotels & Resorts Ltd"}}},{"node":{"Id":"001ak00000MoLUWAA3","Name":{"value":"United Oil & Gas Corp."}}},{"node":{"Id":"001ak00000MoLUXAA3","Name":{"value":"Express Logistics and Transport"}}},{"node":{"Id":"001ak00000MoLUYAA3","Name":{"value":"University of Arizona"}}},{"node":{"Id":"001ak00000MoLUZAA3","Name":{"value":"United Oil & Gas, UK"}}},{"node":{"Id":"001ak00000MoLUaAAN","Name":{"value":"United Oil & Gas, Singapore"}}}]}}}}';
    //     const gqlResult = JSON.parse(json);

    //     const res = parseQuery(gqlResult.uiapi.query);
        
        
    //     expect(res.Account[0].Id).toBe('001ak00000MoLURAA3');
    //     expect(res.Account[0].Name.value).toBe('Edge Communications');
    // });

    // it('tests the parsing of complex gql query results with datatablemode ON', () => {
    //     const json = '{"uiapi":{"query":{"Account":{"edges":[{"node":{"Id":"001ak00000MoLURAA3","Active__c":{"value":"Yes"},"Name":{"value":"Edge Communications"},"BestAccountFriend__r":{"Id":"001ak00000MoLUTAA3","Active__c":{"value":"Yes"},"Name":{"value":"Pyramid Construction Inc."}},"BestFriend__r":{"Id":"003ak000003ORbkAAG","Name":{"value":"Stella Pavlova"}},"Owner":{"Name":{"value":"Gandalf Stormcrow"}},"Contacts":{"edges":[{"node":{"Id":"003ak000003ORbdAAG","Name":{"value":"Rose Gonzalez"},"Account":{"Id":"001ak00000MoLURAA3","Owner":{"Name":{"value":"Gandalf Stormcrow"}},"Name":{"value":"Edge Communications"}}}},{"node":{"Id":"003ak000003ORbeAAG","Name":{"value":"Sean Forbes"},"Account":{"Id":"001ak00000MoLURAA3","Owner":{"Name":{"value":"Gandalf Stormcrow"}},"Name":{"value":"Edge Communications"}}}}]}}}]},"Contact":{"edges":[{"node":{"Id":"003ak000003ORbdAAG","Name":{"value":"Rose Gonzalez"},"Account":{"Id":"001ak00000MoLURAA3","Owner":{"Name":{"value":"Gandalf Stormcrow"}},"Name":{"value":"Edge Communications"}}}}]}}}}';
    //     const gqlResult = JSON.parse(json);

    //     const res = parseQuery(gqlResult.uiapi.query, true);

    //     expect(res.Account[0].Id).toBe('001ak00000MoLURAA3');
    //     expect(res.Account[0].Name).toBe('Edge Communications');

    //     // custom field
    //     expect(res.Account[0].Active).toBe('Yes');

    //     // parent relationship
    //     expect(res.Account[0].BestAccountFriendName).toBe('Pyramid Construction Inc.')

    //     // another parent relationship
    //     expect(res.Account[0].BestFriendId).toBe('003ak000003ORbkAAG');

    //     // child relationship
    //     expect(res.Account[0].Contacts[0].Id).toBe('003ak000003ORbdAAG');
    //     expect(res.Account[0].Contacts[0].Name).toBe('Rose Gonzalez');

    //     // child relationship + double parent relationship
    //     expect(res.Account[0].Contacts[0].AccountOwnerName).toBe('Gandalf Stormcrow');
    // })

    // it('tests the parsing of complex gql query results with datatablemode OFF', () => {
    //     const json = '{"uiapi":{"query":{"Account":{"edges":[{"node":{"Id":"001ak00000MoLURAA3","Active__c":{"value":"Yes"},"Name":{"value":"Edge Communications"},"BestAccountFriend__r":{"Id":"001ak00000MoLUTAA3","Active__c":{"value":"Yes"},"Name":{"value":"Pyramid Construction Inc."}},"BestFriend__r":{"Id":"003ak000003ORbkAAG","Name":{"value":"Stella Pavlova"}},"Owner":{"Name":{"value":"Gandalf Stormcrow"}},"Contacts":{"edges":[{"node":{"Id":"003ak000003ORbdAAG","Name":{"value":"Rose Gonzalez"},"Account":{"Id":"001ak00000MoLURAA3","Owner":{"Name":{"value":"Gandalf Stormcrow"}},"Name":{"value":"Edge Communications"}}}},{"node":{"Id":"003ak000003ORbeAAG","Name":{"value":"Sean Forbes"},"Account":{"Id":"001ak00000MoLURAA3","Owner":{"Name":{"value":"Gandalf Stormcrow"}},"Name":{"value":"Edge Communications"}}}}]}}}]},"Contact":{"edges":[{"node":{"Id":"003ak000003ORbdAAG","Name":{"value":"Rose Gonzalez"},"Account":{"Id":"001ak00000MoLURAA3","Owner":{"Name":{"value":"Gandalf Stormcrow"}},"Name":{"value":"Edge Communications"}}}}]}}}}';
    //     const gqlResult = JSON.parse(json);

    //     const res = parseQuery(gqlResult.uiapi.query);

    //     expect(res.Account[0].Id).toBe('001ak00000MoLURAA3');
    //     expect(res.Account[0].Name.value).toBe('Edge Communications');

    //     // custom field
    //     expect(res.Account[0].Active.value).toBe('Yes');

    //     // parent relationship
    //     expect(res.Account[0].BestAccountFriend.Name.value).toBe('Pyramid Construction Inc.')

    //     // another parent relationship
    //     expect(res.Account[0].BestFriend.Id).toBe('003ak000003ORbkAAG');

    //     // child relationship
    //     expect(res.Account[0].Contacts[0].Id).toBe('003ak000003ORbdAAG');
    //     expect(res.Account[0].Contacts[0].Name.value).toBe('Rose Gonzalez');

    //     // child relationship + double parent relationship
    //     expect(res.Account[0].Contacts[0].Account.Owner.Name.value).toBe('Gandalf Stormcrow');
    // })

});