module.exports = {

    getAll: function* getAll(req, res) {
        console.info('Incoming request:\n\t' + req.body);

        let units = yield ControlableUnit.find();

        res.send(JSON.stringify(units));
        return units;
    },

    get: function* get(req, res) {

        let id = res.params.id;

        if (!id) {
            res.sendStatus(404);
            return;
        }


        console.info('Incoming request:\n\t' + req.body);

        let units = yield ControlableUnit.find();

        res.send(JSON.stringify(units));
        return units;
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