
const router = {
    'ping': (data,callback) => {
        callback(200)
    },
};

const notDefinedHandler = (data,callback) => {
    callback(404);
};


module.exports = {
  router, notDefinedHandler
};
