"use strict";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const BOT_PORT = process.env.PORT || 3000;

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/actions', function (req, res) {
  res.json({
    "actions": [
      {
        "name": "recommend",
        "value": "yes"
      }
    ],
    "callback_id": "TEST_123",
    "team": {
      "id": "T47563693",
      "domain": "watermelonsugar"
    },
    "channel": {
      "id": "C065W1189",
      "name": "forgotten-works"
    },
    "user": {
      "id": "U045VRZFT",
      "name": "brautigan"
    },
    "action_ts": "1466766246.000002",
    "attachment_id": "1",
    "token": SLACK_BOT_TOKEN,
    "original_message": "",
    "response_url": "https://hooks.slack.com/actions/T47563693/"
    }
  );
});

app.listen(BOT_PORT, function () {
  console.log('Example app listening on port: ' + BOT_PORT);
});

let Botkit = require('botkit'),
    formatter = require('./modules/slack-formatter'),
    salesforce = require('./modules/salesforce'),

    controller = Botkit.slackbot(),

    bot = controller.spawn({
        token: SLACK_BOT_TOKEN
    });

bot.startRTM(err => {
    if (err) {
        throw new Error('Could not connect to Slack');
    }
});


controller.hears(['help'], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.reply(message, {
        text: `You can ask me things like:
    "Search account Acme" or "Search Acme in acccounts"
    "Search contact Lisa Smith" or "Search Lisa Smith in contacts"
    "Search opportunity Big Deal"
    "Create contact"
    "Create case"`
    });
});


controller.hears(['search account (.*)', 'search (.*) in accounts'], 'direct_message,direct_mention,mention', (bot, message) => {
    let name = message.match[1];
    salesforce.findAccount(name)
        .then(accounts => bot.reply(message, {
            text: "I found these accounts matching  '" + name + "':",
            attachments: formatter.formatAccounts(accounts)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['search contact (.*)', 'find contact (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    let name = message.match[1];
    salesforce.findContact(name)
        .then(contacts => bot.reply(message, {
            text: "I found these contacts matching  '" + name + "':",
            attachments: formatter.formatContacts(contacts)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['top (.*) deals', 'top (.*) opportunities'], 'direct_message,direct_mention,mention', (bot, message) => {
    let count = message.match[1];
    salesforce.getTopOpportunities(count)
        .then(opportunities => bot.reply(message, {
            text: "Here are your top " + count + " opportunities:",
            attachments: formatter.formatOpportunities(opportunities)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['search opportunity (.*)', 'find opportunity (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {

    let name = message.match[1];
    salesforce.findOpportunity(name)
        .then(opportunities => bot.reply(message, {
            text: "I found these opportunities matching  '" + name + "':",
            attachments: formatter.formatOpportunities(opportunities)
        }))
        .catch(error => bot.reply(message, error));

});

controller.hears(['create case', 'new case'], 'direct_message,direct_mention,mention', (bot, message) => {

    let subject,
        description;

    let askSubject = (response, convo) => {

        convo.ask("What's the subject?", (response, convo) => {
            subject = response.text;
            askDescription(response, convo);
            convo.next();
        });

    };

    let askDescription = (response, convo) => {

        convo.ask('Enter a description for the case', (response, convo) => {
            description = response.text;
            salesforce.createCase({subject: subject, description: description})
                .then(_case => {
                    bot.reply(message, {
                        text: "I created the case:",
                        attachments: formatter.formatCase(_case)
                    });
                    convo.next();
                })
                .catch(error => {
                    bot.reply(message, error);
                    convo.next();
                });
        });

    };

    bot.reply(message, "OK, I can help you with that!");
    bot.startConversation(message, askSubject);

});

controller.hears(['create contact', 'new contact'], 'direct_message,direct_mention,mention', (bot, message) => {

    let firstName,
        lastName,
        title,
        phone;

    let askFirstName = (response, convo) => {

        convo.ask("What's the first name?", (response, convo) => {
            firstName = response.text;
            askLastName(response, convo);
            convo.next();
        });

    };

    let askLastName = (response, convo) => {

        convo.ask("What's the last name?", (response, convo) => {
            lastName = response.text;
            askTitle(response, convo);
            convo.next();
        });

    };

    let askTitle = (response, convo) => {

        convo.ask("What's the title?", (response, convo) => {
            title = response.text;
            askPhone(response, convo);
            convo.next();
        });

    };

    let askPhone = (response, convo) => {

        convo.ask("What's the phone number?", (response, convo) => {
            phone = response.text;
            salesforce.createContact({firstName: firstName, lastName: lastName, title: title, phone: phone})
                .then(contact => {
                    bot.reply(message, {
                        text: "I created the contact:",
                        attachments: formatter.formatContact(contact)
                    });
                    convo.next();
                })
                .catch(error => {
                    bot.reply(message, error);
                    convo.next();
                });
        });

    };

    bot.reply(message, "OK, I can help you with that!");
    bot.startConversation(message, askFirstName);

});

controller.on('interactive_message_callback', function(bot, message) {
    bot.replyInteractive(message, {
        text: '...  ouh ...',
        attachments: [
            {
                title: 'My buttons',
                callback_id: 'TEST_123',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"yes",
                        "text": "Yes!",
                        "value": "yes",
                        "type": "button",
                    },
                    {
                       "text": "No!",
                        "name": "no",
                        "value": "delete",
                        "style": "danger",
                        "type": "button",
                        "confirm": {
                          "title": "Are you sure?",
                          "text": "This will do something!",
                          "ok_text": "Yes",
                          "dismiss_text": "No"
                        }
                    }
                ]
            }
        ]
    });

});
