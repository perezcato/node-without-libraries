const db = require('./lib/data');

const { checkTokenValidity,parseData } = require('./lib/helpers');
const { index,create,deleteUser } = require('./controllers/UserController');
const { createToken,updateToken,deleteToken } = require('./controllers/TokenController');
const { createCheck,getCheck, deleteCheck } = require('./controllers/ChecksController');
const { siteIndex } = require('./controllers/SiteController');

const router = {

    '': (data, callback) => {
        const { method } = data;
        console.log('method is called');
        switch (method) {
            case 'get':
                siteIndex(data, callback);
                break;
            default:
                this.notDefinedHandler(data, callback);
        }
    },

    /*
     * Api specific routes
     */

    'ping': (data, callback) => {
        callback(200)
    },
    'api/user': (data, callback) => {
        const method = data.method;
        switch (method) {
            case 'get':
                index(data,callback);
                break;
            case 'post':
                create(data, callback);
                break;
            case 'delete':
                deleteUser(data,callback);
                break;
            default:
                notDefinedHandler(data,callback);
        }
    },
    'api/token': (data, callback) => {
        const method = data.method;
            switch (method) {
                case 'post':
                    createToken(data,callback);
                    break;
                case 'put':
                    updateToken(data, callback);
                    break;
                case 'delete':
                    deleteToken(data,callback);
                    break;
                default:
                    notDefinedHandler(data,callback);
            }
    },
    'api/checks': (data, callback) => {
        const method = data.method;
        const { token } = data.headers;
        checkTokenValidity(token,(tokenData) => {
            if(tokenData){
                console.log(tokenData);
                db.read('users',tokenData.phone,(err,userData) => {
                    if(!err && userData) {
                        switch (method) {
                            case 'get':
                                getCheck(data,parseData(userData),callback);
                                break;
                            case 'post':
                                createCheck(data,parseData(userData),callback);
                                break;
                            case 'delete':
                                deleteCheck(data,parseData(userData),callback);
                                break;
                            default:
                                notDefinedHandler(data,callback);
                        }
                    }else{
                        callback(500,{'message': 'something went wrong'})
                    }
                });
            } else
                callback (403, {'error': 'you are not authorised'});
        });
    },

    /*
     * End of Api specific routes
     */

};

const notDefinedHandler = (data, callback) => {
    callback(404);
};
module.exports = {
    router, notDefinedHandler
};
