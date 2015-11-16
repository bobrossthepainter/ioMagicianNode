
import { app } from './index';

console.log('app imported');

var debug = require('debug')('ioMagicianBackend');

//var app = require('../lib/index');


app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
  debug('Express server listening on port ' + server.address().port);
});
