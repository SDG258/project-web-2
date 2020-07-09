const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC5c9c857422a7e9ff20545d310c8d9a84';
const authToken = process.env.AUTH_TOKEN || 'f73a0d62b6426768d946c27147fdd1fd';
const client = require('twilio')(accountSid, authToken);

async function send(to, content) {
    client.messages.create({
        body: content, 
        from: '+12565787140', 
        to: to
    });
}

module.exports = { send };