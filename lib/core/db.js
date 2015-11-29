const Mongorito = require('mongorito');
//const co = require('co');
const config = require('./../config');


function* connect() {
    yield Mongorito.connect(config.mongoDB);
}

function* disconnect() {
    yield Mongorito.disconnect();
}

module.exports = {
    connect: connect,
    disconnect: disconnect
}