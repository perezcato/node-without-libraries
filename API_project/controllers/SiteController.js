const { getPage } = require('../lib/helpers');


exports.siteIndex = (data, callback) => {
    getPage('index.html',(page) => {
       callback(200,page,'html');
    });
};
