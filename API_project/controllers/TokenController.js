const db = require('../lib/data');
const { parseData,generateHash,generateRandomString } = require('../lib/helpers');

exports.createToken = (data, callback) => {
    const phone = typeof data.payload.phone === 'string' && data.payload.phone.trim().length === 10 ?
        data.payload.phone:false;
    const password = typeof data.payload.password === 'string' && data.payload.phone.trim().length > 0 ?
        data.payload.password:false;
    if(phone && password){
        db.read('users',phone,(err,data) => {
            if(!err && data){
                const userData = parseData(data);
                if(generateHash(password) === userData.Password){
                    const tokenData = {
                        token: generateRandomString(48),
                        phone,
                        expires: Date.now() + 1000*60*60
                    };
                    db.create('tokens', tokenData.token,tokenData,(err) => {
                        if(!err){
                            callback(200,tokenData);
                        } else {
                            callback('500', {'Error': 'something went wrong'})
                        }
                    });
                }else
                    callback(403,{'Error': 'incorrect password'})
            }else
                callback(404,{'Error': 'user does not exist'});
        });
    }else
        callback(422,{'Error': 'enter the required fields'});

};

exports.updateToken = (data, callback) => {
    console.log('in the update function');
    const update = typeof data.payload.extend === 'string' && data.payload.extend.trim() === 'true' ?
        data.payload.extend.trim():false;
    const token = typeof data.headers.token === 'string' && data.headers.token.trim().length === 48 ?
        data.headers.token:false;
    console.log(update, token);
    if(token){
        console.log('token passed');
        if(update){
            db.read('tokens',token , (err,data) => {
                if(!err && data){
                    if(Date.now() > parseData(data).expires){
                        const userData = parseData(data);
                        userData.expires = Date.now() + 1000*60*60;
                        db.update('tokens',token,userData, (err) => {
                            if(!err){
                                callback(202,{'message': 'token session extended'})
                            }else{
                                callback(500, {'error': 'Something went wrong'});
                            }
                        })
                    }else {
                        callback(403,{'error': 'token has expired'})
                    }
                }else{
                    callback(404,{'error': 'user token not found'})
                }
            })

        }else{
            callback(422,{'error': 'Please enter required fields'})
        }
    }else{
        callback(403,{'error': 'you must be verified'});
    }

};

exports.deleteToken = (data, callback) => {
    const token = typeof data.headers.token === 'string' && data.headers.token.trim().length === 48 ?
        data.headers.token:false;
    console.log(data.headers);
    if(token){
        db.delete('tokens',token, (err) => {
            if(!err){
                callback(204,{'error': 'token deleted'})
            }else
                callback(500,{'error': 'internal server error'})
        })
    }else
        callback(422,{'error': 'please enter required error'});
};
