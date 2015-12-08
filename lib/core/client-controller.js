const co = require('co');


export default class ClientController {
    constructor(express, db, controllerRoutes, model) {
        this.express = express;
        this.db = db;
        this.controllerRoutes = controllerRoutes;
        this.model = model;
    }

    init() {
        let self = this;
        let routes = this.controllerRoutes.controllers;
        for (let route of routes) {

            self.express[route.type](route.path, function (req, res) {
                let controller = require('../api/controller/' + route.controller);
                co(function* () {
                    yield self.db.connect();
                    console.log("connected");

                    let method = controller[route.method](req, res);

                    return yield co(method);

                }).then(function (value) {
                    console.log(value);
                    self.db.disconnect();
                }, function (err) {
                    console.error(err.stack);
                    self.db.disconnect();
                });
                //
                //res.send('Hello World!');
                //console.log('hello world requested');
            });
        }
    }
}