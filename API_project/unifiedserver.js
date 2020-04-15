const { router, notDefinedHandler } = require('./routes');
const url = require('url');
const { StringDecoder, } = require('string_decoder');
const { parseData } = require('./lib/helpers');
module.exports = (req,res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headers = req.headers;
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer+=decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();
        const payload = parseData(buffer);
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ?
            router[trimmedPath] : notDefinedHandler;
        const data = {
            trimmedPath,
            headers,
            queryStringObject,
            payload,
            method
        };
        chosenHandler(data, (statusCode, data,content) => {
            const contentType = typeof content === 'string' ? content: 'json';
            statusCode = typeof statusCode === 'number' ? statusCode : 200;

            let payloadString = '';
            if(contentType === 'json'){
                data = typeof data === 'object' ? data : {};
                payloadString = JSON.stringify(data);
                res.writeHead(statusCode,{
                    'Content-Type': 'application/json'
                });
            }else{
                data = typeof data === 'string' ? data : '';
                payloadString = data;
                res.writeHead(statusCode,{
                    'Content-Type': 'text/html'
                });
            }

            res.end(payloadString);
        });
    });
};
