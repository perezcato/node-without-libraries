const db = require('./lib/data');
const { parseData } = require('./lib/helpers');
const url = require('url');
const http = require('http');
const https = require('https');

exports.getAllChecks = () => {
    db.list('checks',(err,checkIds) => {
        if(!err && checkIds && checkIds.length > 0){
            checkIds.forEach(check => {
                db.read('checks',check,(err,checkData) => {
                    if(!err && checkData)
                        this.validateCheckData(parseData(checkData));
                    else
                        console.log('Checks are emppty or not defined');
                });
            });
        }else{
            console.log(checkIds);
        }
    });
};

exports.validateCheckData = (data) => {
    data.state = typeof data.state === 'string' && ['up','down'].indexOf(data.state) > -1 ? data.state : 'down';
    data.lastChecked = typeof data.lastChecked === 'number' && data.lastChecked > 0 ? data.lastChecked : false;
    if(data)
        this.performChecks(data);
    else
        console.log('something went wrong');
};

exports.performChecks = data => {
    let checkOutcome = {
        'error': false,
        'responseCode': false
    };

    let outcomeSent = false;
    const parseUrl = url.parse(`${data.protocol}://${data.url}`,true);
    const hostname  = parseUrl.hostname;
    const path = parseUrl.path;

    const requestDetails = {
        'protocol': `${data.protocol}:`,
        'hostname': hostname,
        'method': data.method.toUpperCase(),
        'path': path,
        'timeout': data.timeoutSeconds * 1000
    };
    if(data.protocol === 'http'){
        const req = http.request(requestDetails,(res) => {
            checkOutcome.responseCode = res.statusCode;
            if(!outcomeSent) {
                this.processCheckOutcomes(data, checkOutcome);
                outcomeSent = true;
            }
        });
        req.on('error', (error) => {
            console.log('Something went wrong hitting the website');
        });
        req.on('timeout', () => {
            checkOutcome.error = true;
            if(!outcomeSent){
                this.processCheckOutcomes(data, checkOutcome);
                outcomeSent = true;
            }
        });
        req.end();
    } else {
        const req = https.request(requestDetails,(res) => {
            checkOutcome.responseCode = res.statusCode;
            if(!outcomeSent) {
                this.processCheckOutcomes(data, checkOutcome);
                outcomeSent = true;
            }
        });
        req.on('error', (error) => {
            console.log('Something went wrong hitting the website');
        });
        req.on('timeout', () => {
            checkOutcome.error = true;
            if(!outcomeSent){
                this.processCheckOutcomes(data, checkOutcome);
                outcomeSent = true;
            }
        });
        req.end();
    }
};

exports.processCheckOutcomes = (checkData,checkOutcome) => {
    const state = !checkOutcome.error && checkOutcome.responseCode &&
    checkData.successCodes.indexOf(checkOutcome.responseCode) > -1 ?
        'up': 'down';
    const newCheckData = checkData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();
    db.update('checks',newCheckData.checkId,newCheckData,(err) => {
        if(checkData.lastChecked && checkData.state !== state)
            console.log('The site is down');
        else
            console.log('The outcome has not changed');
    });
};

exports.init = () => {
    console.log('checking');
    this.getAllChecks();
    setInterval(() =>{
        this.getAllChecks();
    },5000);
};
