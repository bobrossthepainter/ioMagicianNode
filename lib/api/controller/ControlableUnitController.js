import {  } from "../service/ActionService"

module.exports = {

    register: function* register(req, res){
        console.info('Registering:\n\t' + req.body);

        let unitBody = req.body;
        let ports = req.body.ports;

        delete req.body.ports;

        let unit = new ControlableUnit(req.body);
        yield unit.save();

        let unitId = unit.get('_id') + '';

        let persistedPortIds = [];

        if (ports){
            for (let port of ports) {
                port.controlableUnit = unitId;
                let persistedPort = new Port(port);
                yield persistedPort.save();

                let actions = yield ActionService.generateActionsFromPort(persistedPort.attributes);
                let actionArray = [];
                for(let action of actions){
                    actionArray.push(action.attributes);
                }
                persistedPort.set('actions', actionArray);
                yield persistedPort.save();

                persistedPortIds.push(persistedPort.get('_id') + '');
            }
        }

        unit.set('ports', persistedPortIds);
        yield unit.save();



        res.status(201).send(unit.get('_id'));
    },

    getAll: function* getAll(req, res) {
        console.info('Incoming request:\n\t' + req.body);

        let units = yield ControlableUnit.find();

        res.send(units);
        return units;
    },

    get: function* get(req, res) {

        let id = req.params.id;

        if (!id) {
            res.sendStatus(404);
            return;
        }


        console.info('Incoming request:\n\t' + req.body);

        let unit = yield ControlableUnit.populate('ports', Port).find({ _id : id });

        res.send(unit);
        return unit;
    },

    put: function* put(req, res) {

        let id = req.params.id;

        if (!id) {
            res.sendStatus(404);
            return;
        }

        console.info('Incoming request:\n\t' + req.body);

        let units = yield ControlableUnit.find({ _id : id });

        if (units.length == 0){
            res.sendStatus(404);
            return;
        }

        let unit = units[0];

        unit.set(req.body);
        yield unit.save();

        res.sendStatus(200);
        return unit;
    },

    post: function* post(req, res) {
        console.info('Incoming request:\n\t' + req.body);

        let unit = new ControlableUnit(req.body);

        try {
            yield unit.save();
        } catch (err) {
            res.status(500).send(err.message);
            return;
        }

        res.status(201).send(unit.get('_id'));
    }

};