export const Mongorito = require('mongorito');
const Model = Mongorito.Model;
//const co = require('co');
//const config = require('../config');

// define model
export class ControlableUnit extends Model {
    configure() {
        this.before('save', 'validate');

        let obj = this.attributes;

        let persistObj = {
            name: obj.name,
            description: obj.description,
            ports: obj.ports,
            login: obj.login,
            credentials: obj.credentials,
            address: obj.address
        }

        this.attributes = persistObj;
    }

    * validate(next) {
        let obj = this.attributes;

        if (!obj.name) {
            throw new Error('Name is missing');
        }
        if (!obj.address) {
            throw new Error('Address is missing');
        }

        yield next;
    }

    * checkIfExists(next) {

        yield next;
    }

    * createFromInput(input) {

    }

}

export class Port extends Model {

}

//export let dBConnection = {
//    connect: connect,
//    disconnect: disconnect
//}

//function connect() {
//    yield Mongorito.connect(config.mongoDB);
//}
//
//function disconnect() {
//    yield Mongorito.disconnect();
//}

module.exports = {
    modelName: 'ControlableUnit',
    model: ControlableUnit
}