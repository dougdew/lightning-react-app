import * as h from './h';

let url = "/brokers";

let filterFindResult = (result) => {
    let records = result.records;
    for (var i = 0; i < records.length; i++) {
        records[i].broker_id = records[i].Id;
        records[i].first_name = records[i].FirstName__c;
        records[i].last_name = records[i].LastName__c;
        records[i].name = records[i].Name;
        records[i].title = records[i].Title__c;
        records[i].office_phone = records[i].OfficePhone__c;
        records[i].mobile_phone = records[i].MobilePhone__c;
        records[i].email = records[i].Email__c;
    }
    return records;
}

let getFirstRecord = (result) => {
    let filteredResult = filterFindResult(result);
    if (filteredResult.length == 1) {
        return filteredResult[0];
    }
    else {
        return null;
    }
};

let filterCreateOrUpdateInput = (broker) => {
    let filteredBroker = {};
    filteredBroker.FirstName__c = broker.first_name;
    filteredBroker.LastName__c = broker.last_name;
    filteredBroker.Name = broker.name;
    filteredBroker.Title__c = broker.title;
    filteredBroker.OfficePhone__c = broker.office_phone;
    filteredBroker.MobilePhone__c = broker.mobile_phone;
    filteredBroker.Email__c = broker.email;
    return filteredBroker;
}

export let findAll = sort => {
    if (sort === "broker_id") {
        sort = "Id";
    }
    else if (sort) {
        sort = sort + "__c"; // FIX THIS
    }
    let q = "SELECT Id, FirstName__c, LastName__c, Name, Title__c, OfficePhone__c, MobilePhone__c, Email__c FROM Broker__c";
    if (sort) {
        q = q + " ORDER BY " + sort
    }
    return h.get("/query", {q}, filterFindResult);
}

export let findByProperty = propertyId => {
    let q = "SELECT Id, FirstName__c, LastName__c, Name, Title__c, OfficePhone__c, MobilePhone__c, Email__c FROM Broker__c " +
            "WHERE Id IN " +
            "(SELECT Broker__r.Id FROM PropertyBroker__c WHERE Property__r.Id = '" + propertyId + "') " +
            "ORDER BY LastName__c";
    return h.get("/query", {q}, getFirstRecord);
}

export let findByName = name => {
    let q = "SELECT Id, FirstName__c, LastName__c, Name, Title__c, OfficePhone__c, MobilePhone__c, Email__c FROM Broker__c WHERE Name = '" + name + "'";
    return h.get("/query", {q}, getFirstRecord);
}

export let findById = id => {
    let q = "SELECT Id, FirstName__c, LastName__c, Name, Title__c, OfficePhone__c, MobilePhone__c, Email__c FROM Broker__c WHERE Id = '" + id + "'";
    return h.get("/query", {q}, getFirstRecord);
}

export let updateItem = broker => {
    if (!broker.broker_id) {
        return;
    }
    let filteredBroker = filterCreateOrUpdateInput(broker);
    return h.patch("/sobjects/Broker__c/" + broker.broker_id, filteredBroker);
}

export let createItem = broker => {
    let filteredBroker = filterCreateOrUpdateInput(broker);
    return h.post("/sobjects/Broker__c/", filteredBroker);
}

export let deleteItem = id => {
    return h.del("/sobjects/Broker__c/" + id);
}