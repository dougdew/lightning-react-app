import * as h from './h';

let filterFindResult = (result) => {
    let records = result.records;
    for (var i = 0; i < records.length; i++) {
        records[i].property_id = records[i].Id;
        records[i].address = records[i].Address__c;
        records[i].city = records[i].City__c;
        records[i].state = records[i].State__c;
        records[i].zip = records[i].Zip__c;
        records[i].bedrooms = records[i].Bedrooms__c;
        records[i].bathrooms = records[i].Bathrooms__c;
        records[i].price = records[i].Price__c;
        records[i].location = records[i].Location__c;
        records[i].pic = records[i].Pic__c;
        records[i].teaser = records[i].Teaser__c;
        records[i].description = records[i].Description__c;
        records[i].size = records[i].Size__c;
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

let filterCreateOrUpdateInput = (property) => {
    let filteredProperty = {};
    filteredProperty.Address__c = property.address;
    filteredProperty.City__c = property.city;
    filteredProperty.State__c = property.state;
    filteredProperty.Zip__c = property.zip;
    filteredProperty.City__c = property.city;
    filteredProperty.Bedrooms__c = property.bedrooms;
    filteredProperty.Bathrooms__c = property.bathrooms;
    filteredProperty.Price__c = property.price;
    filteredProperty.Location__c = property.location;
    filteredProperty.Pic__c = property.pic;
    filteredProperty.Teaser__c = property.teaser;
    filteredProperty.Description__c = property.description;
    filteredProperty.Size__c = property.size;
    return filteredProperty;
}

export let findAll = sort => {
    if (sort === "property_id") {
        sort = "Id";
    }
    else if (sort) {
        sort = sort + "__c"; // FIX THIS
    }
    let q = "SELECT Id, Address__c, City__c, State__c, Zip__c, Bedrooms__c, Bathrooms__c, Price__c, Location__c, Pic__c FROM Property__c";
    if (sort) {
        q = q + " ORDER BY " + sort
    }
    return h.get("/query", {q}, filterFindResult);
};

export let findByName = name => {
    let q = "SELECT Id, Address__c, City__c, State__c, Zip__c, Bedrooms__c, Bathrooms__c, Price__c, Location__c, Pic__c, Teaser__c, Description__c, Size__c FROM Property__c WHERE Name = '" + name + "'";
    return h.get("/query", {q}, getFirstRecord);
};

export let findByBroker = brokerId => {
    let q = "SELECT Id, Address__c, City__c, State__c, Zip__c, Bedrooms__c, Bathrooms__c, Price__c, Location__c, Pic__c, Teaser__c, Description__c, Size__c FROM Property__c " +
            "WHERE Id IN " +
            "(SELECT Property__c FROM PropertyBroker__c WHERE Broker__c = '" + brokerId + "') "
            "ORDER BY Address__c";
    return h.get("/query", {q}, getFirstRecord);
};

export let findById = id => {
    let q = "SELECT Id, Address__c, City__c, State__c, Zip__c, Bedrooms__c, Bathrooms__c, Price__c, Location__c, Pic__c, Teaser__c, Description__c, Size__c FROM Property__c WHERE Id = '" + id + "'";
    return h.get("/query", {q}, getFirstRecord);
};

export let updateItem = property => {
    if (!property.property_id) {
        return;
    }
    let filteredProperty = filterCreateOrUpdateInput(property);
    return h.patch("/sobjects/Property__c/" + property.property_id, filteredProperty);
}

export let createItem = property => {
    let filteredProperty = filterCreateOrUpdateInput(property);
    return h.post("/sobjects/Property__c/", filteredProperty);
}

export let deleteItem = id => {
    return h.del("/sobjects/Property__c/" + id);
}