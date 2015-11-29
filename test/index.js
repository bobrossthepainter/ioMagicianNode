import assert from 'assert';
const controller = require("../lib/core/client/controller/ControlableUnitController");
const co = require('co');

describe('ControlableUnitController', function () {
    describe('getAll', function () {
        it('should set response body', function () {
            let req;
            let res;
            co(controller.getAll(req, res));
            assert(false, 'we expected this package author to add actual unit tests.');
        });
    });

});
