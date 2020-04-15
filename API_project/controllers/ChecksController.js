const db = require('../lib/data');
const { generateRandomString,parseData } = require('../lib/helpers');

exports.createCheck = (data,userData,callback) => {
    let { protocol, method, successCodes,url, timeoutSeconds } = data.payload;
    let checks = typeof userData.checks != 'undefined' ? userData.checks : [];
    protocol = typeof protocol === 'string' && ['http','https'].indexOf(protocol) > -1 ?
        protocol : false;
    method = typeof method === 'string' && ['get','post'].indexOf(method.toLowerCase()) > -1 ?
        method : false;
    successCodes = typeof successCodes === 'object' && successCodes instanceof Array > -1 ?
        successCodes : false;
    url = typeof url === 'string' && url.trim().length > 0 ?
        url : false;
    timeoutSeconds = typeof timeoutSeconds === 'number' && timeoutSeconds % 1 === 0 && timeoutSeconds >=1 ?
        timeoutSeconds : false;
    if(protocol && method && successCodes && url && timeoutSeconds){
        if (checks.length < 5) {
            const checkId = generateRandomString(48);
            const checkData = {
                 checkId,
                 protocol,
                 method,
                 timeoutSeconds,
                 successCodes,
                 url,
                phone: userData.Phone
            };
            db.create('checks',checkId,checkData,(err) => {
                checks.push(checkId);
                userData.checks = checks;
                db.update('users',userData.Phone,userData,(err) => {
                    if(!err){
                        callback(200,checkData);
                    }else
                        callback(500,{'error': 'something went wrong'});
                });
            })
        }else
            callback (422, {'error': 'cannot create more checks'});
    }else {
        callback(422, { 'error':  'enter required fields'});
    }
};
exports.getCheck = (data,userData,callback) => {
    const checkId = typeof data.queryStringObject.checkid === 'string' && data.queryStringObject.checkid.trim().length === 48?
        data.queryStringObject.checkid : false;
    if(checkId){
        db.read('checks',checkId,(err, checkData) => {
            if(!err && checkData){
                callback(200,parseData(checkData));
            }else{
                callback(404,{'error': 'Check does not exist'});
            }
        });
    }else{
        callback(422, {'error': 'enter required fields'});
    }
};
exports.deleteCheck = (data,userData,callback) => {
    const checkId = typeof data.queryStringObject.checkid === 'string' &&
    data.queryStringObject.checkid.trim().length === 48?
        data.queryStringObject.checkid : false;
    if(checkId){
        db.delete('checks',checkId,(err) => {
            if(!err){
                userData.checks.splice(userData.checks.indexOf(checkId),1);
                db.update('users',userData.Phone,userData,(err) => {
                    if(!err)
                        callback(204);
                    else
                        callback(500,{'error': 'Something went wrong'});
                });
            }else{
                callback(404,{'error': 'Something went wrong'});
            }
        });
    }else{
        callback(422, {'error': 'enter required fields'});
    }
};


