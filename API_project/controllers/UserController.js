const db = require('../lib/data');
const { generateHash } = require('../lib/helpers');


exports.index = (data, callback) => {
    const phone = typeof data.queryStringObject.phone === 'string' ? data.queryStringObject.phone : false;
    if(phone){
        db.read('users',phone,(err,data) => {
            if(!err && data){
                data = JSON.parse(data);
                callback(200,{
                    firstName: data['First Name'],
                    lastName: data['Last Name'],
                    phone: data['Phone']
                });
            } else {
                callback(404,{'error': 'user does not exist'});
            }
        });
    } else {
        callback(422,{'error': 'enter required fields'});
    }
};
exports.create = (data, callback) => {
    const firstName = typeof data.payload.firstName === 'string' &&
    data.payload.firstName.trim().length > 0 ?
        data.payload.firstName : false;

    const lastName = typeof data.payload.lastName === 'string' &&
    data.payload.lastName.trim().length > 0 ?
        data.payload.lastName : false;

    const phone = typeof data.payload.phone === 'string' &&
    data.payload.phone.trim().length === 10 ?
        data.payload.phone : false;

    const password = typeof data.payload.password === 'string' &&
    data.payload.password.trim().length > 0 ?
        data.payload.password : false;

    const tosAgreement = typeof data.payload.tosAgreement === 'string' &&
    data.payload.tosAgreement.trim() === 'true' ?
        data.payload.tosAgreement : false;

    if(firstName && lastName && phone && password && tosAgreement){
        const userData = {
            'First Name': firstName,
            'Last Name': lastName,
            'Phone': phone,
            'Password': generateHash(password),
            'Tos Agreement': tosAgreement
        };
        db.create('users',phone,userData,(err) => {
            if(err){
                callback(403,{'error': 'user already exists'});
            }else{
                callback(200,{'message': 'user created'});
            }
        });
    }else{
        callback(422,{'error': 'enter required fields'});
    }
};
exports.deleteUser = (data, callback) => {
    const phone = typeof data.queryStringObject.phone === 'string' ? data.queryStringObject.phone:false;
    if(phone){
        db.delete('users',phone,(err) => {
            if(!err)
                callback(204);
            else
                callback(404,{'error': 'user does not exit'});
        });
    }else{
        callback(404,{'error': 'please enter required field'})
    }

};
