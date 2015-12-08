import ClientController from './core/client-controller';
const express = require('express')();
const debug = require('debug')('ioMagicianBackend');
const models = require('./core/generator/model-extractor');
const clientControllerRoutes = require('./core/generator/routes-client-generator');
const db = require('./core/db');
const bodyParser = require('body-parser');


//import { dBConnection, ControlableUnit, Port } from './model/controlable-unit';
//console.log('app imported');


//var app = require('../lib/index');


express.set('port', process.env.PORT || 3000);
express.use(bodyParser.json());       // to support JSON-encoded bodies
express.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

let server = express.listen(express.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);

    let clientController = new ClientController(express, db, clientControllerRoutes, models);
    clientController.init();

});


