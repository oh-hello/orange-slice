const server = require('server');

const { get, post } = server.router;
//const { render, redirect } = server.reply;
const ctrl = require('./src/controller/slice');

server({ port: 3000 }, [
  get('/', ctrl.home),
  get('/report', ctrl.report)
]);
