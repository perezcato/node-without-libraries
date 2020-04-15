const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const unifiedServer = require('./unifiedserver');

exports.httpServer = http.createServer((req,res) => {
    unifiedServer(req, res);
});

exports.httpsServer = https.createServer({
    'key': fs.readFileSync(path.join(__dirname,'https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname,'https/cert.pem'))
},(req,res) => {
    unifiedServer(req, res);
});

exports.init = () => {
    this.httpServer.listen(config.httpPort, () => {
        console.log(`The server is running at port ${config.httpPort}`);
    });
    this.httpsServer.listen(config.httpsPort, () => {
        console.log(`The server is running at port ${config.httpsPort}`);
    });
};
