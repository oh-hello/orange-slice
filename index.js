const server = require('server');

const { get, post } = server.router;
//const { render, redirect } = server.reply;
const ctrl = require('./src/controller/slice');

var port = process.env.PORT || 3000;

server({ port: port }, [
  get('/', ctrl.home),
  get('/report', ctrl.report)
]);
