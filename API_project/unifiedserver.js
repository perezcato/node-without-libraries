const { router, notDefinedHandler } = require('./routes');
const url = require('url');
const { StringDecoder } = require('string_decoder');

module.exports = function (req,res) {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headers = req.headers;
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer +=  decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ?
            router[trimmedPath] : notDefinedHandler;
        const data = {
            trimmedPath,
            headers,
            queryStringObject,
            'payload': buffer,
            method
        };
        chosenHandler(data, (statusCode, data) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 200;
            data = typeof data === 'object' ? data : {};
            const payloadString = JSON.stringify(data);
            res.writeHead(statusCode,{
                'Content-Type': 'application/json'
            });
            res.end(payloadString);
        });
    });
};
