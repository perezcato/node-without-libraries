const server = require('./server');
const worker = require('./worker');

const app = () => {
    server.init();
    //worker.init();
};

app();

module.exports = app;
