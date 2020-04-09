const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const env = require('./config');
const unifiedServer = require('./unifiedserver');

const httpServer = http.createServer((req,res) => {
    unifiedServer(req, res);
});

httpServer.listen(env.httpPort, () => {
    console.log(`The server is running at port ${env.httpPort}`);
});


const httpsServer = https.createServer({
    'key': fs.readFileSync(path.join(__dirname,'https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname,'https/cert.pem'))

},(req,res) => {
    unifiedServer(req, res);
});

httpsServer.listen(env.httpsPort, () => {
    console.log(`The server is running at port ${env.httpsPort}`);
});
