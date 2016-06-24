"use strict";

let color = "#009cdb";
let case_color  = "#009900";

let formatAccounts = accounts => {

    if (accounts && accounts.length>0) {
        let attachments = [];
        accounts.forEach(account => {
            let fields = [];
            fields.push({title: "Name", value: account.get("Name"), short:true});
            fields.push({title: "Link", value: "https://login.salesforce.com/" + account.getId(), short:true});
            fields.push({title: "ID", value: account.getId(), short:true});
            var info = "";
            if(account.get("Phone")){
              info += ' ' + account.get("Phone")
            }
            if(account.get("BillingStreet")){
              info += ' ' + account.get("BillingStreet")
            }
            if(account.get("BillingCity")){
              info += ' ' +  account.get("BillingCity")
            }
            if(account.get("BillingState")){
              info += ' ' +  account.get("BillingState")
            }
            fields.push({title: "Info", value: info, short:true});
            attachments.push({
                color: color,
                fields: fields
              }
            );
        });
        return attachments;
    } else {
        return [{text: "No records"}];
    }

};

let formatContacts = contacts => {

    if (contacts && contacts.length>0) {
        let attachments = [];
        contacts.forEach(contact => {
            let fields = [];
            fields.push({title: "Name", value: contact.get("Name"), short:true});
            fields.push({title: "Link", value: "https://login.salesforce.com/" + contact.getId(), short:true});
            fields.push({title: "Phone", value: contact.get("Phone"), short:true});
            fields.push({title: "Mobile", value: contact.get("MobilePhone"), short:true});
            fields.push({title: "Email", value: contact.get("Email"), short:true});
            attachments.push({color: color, fields: fields});
        });
        return attachments;
    } else {
        return [{text: "No records"}];
    }

};

let formatContact = contact => {

    let fields = [];
    fields.push({title: "Name", value: contact.get("FirstName") + " " + contact.get("LastName"), short:true});
    fields.push({title: "Link", value: "https://login.salesforce.com/" + contact.getId(), short:true});
    fields.push({title: "Title", value: contact.get("Title"), short:true});
    fields.push({title: "Phone", value: contact.get("Phone"), short:true});
    return [{color: color, fields: fields}];

};

let formatOpportunities = opportunities => {

    if (opportunities && opportunities.length>0) {
        let attachments = [];
        opportunities.forEach(opportunity => {
            let fields = [];
            fields.push({title: "Opportunity", value: opportunity.get("Name"), short:true});
            fields.push({title: "Link", value: "https://login.salesforce.com/" + opportunity.getId(), short:true});
            fields.push({title: "Stage", value: opportunity.get("StageName"), short:true});
            fields.push({title: "Close Date", value: opportunity.get("CloseDate"), short:true});
            fields.push({title: "Amount", value: new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(opportunity.get("Amount")), short:true});
            fields.push({title: "Probability", value: opportunity.get("Probability") + "%", short:true});
            attachments.push({color: color, fields: fields});
        });
        return attachments;
    } else {
        return [{text: "No records"}];
    }

};

let formatCase = _case => {

    let fields = [];
    fields.push({title: "Subject", value: _case.get("subject"), short: true});
    fields.push({title: "Link", value: 'https://login.salesforce.com/' + _case.get("id"), short: true});
    fields.push({title: "Description", value: _case.get("description"), short: false});
    return [{color: color, fields: fields}];

};

let formatCases = kases => {
  let attachments = [];
  if (kases && kases.length>0) {
    console.log("Formatting cases: #{kases.length}");
    kases.forEach(kase => {
      let fields = [];
      fields.push({title: "Subject", value: kase.get("subject"), short:false});
      fields.push({title: "Link", value: "https://login.salesforce.com/" + kase.getId(), short:true});
      fields.push({title: "Status", value: kase.get("status"), short:true});
      fields.push({title: "Description", value: kase.get("description"), short:false});
      let actions = []
      actions.push({
             "name": "AssignMe",
             "text": "Assign to me",
             "type": "button",
             "value": "meme"
      });
      actions.push({
             "name": "Complete",
             "text": "Complete",
             "type": "button",
             "value": "complete"
      });
      attachments.push({
        color: case_color,
        actions: actions,
        callback_id: "CASEACTION_" + kase.getId(),
        fields: fields
      });
    });
  }
  console.log(attachments);
  return attachments;
};

exports.formatAccounts = formatAccounts;
exports.formatContacts = formatContacts;
exports.formatContact = formatContact;
exports.formatOpportunities = formatOpportunities;
exports.formatCases = formatCases;
exports.formatCase = formatCase;
