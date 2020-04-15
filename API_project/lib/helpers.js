const crypto = require('crypto');
const env = require('../config');
const db = require('./data');
const path = require('path');
const fs = require('fs');

exports.generateHash = (s) => {
    return crypto.createHmac('sha256',env.cryptoSecret)
        .update(s).digest('hex');
};

exports.parseData = (data) => {
    const pData = typeof data === 'string' && data.trim().length > 0 ? data : 'false';
    console.log(pData);
    if(pData){
        try{
            return JSON.parse(pData);
        }catch(error){
            console.log(error)
        }
    }else
        return '';
};

exports.generateRandomString = (strLength) => {
    strLength = typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if(strLength){
        const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
        let randomString = '';
        for(let i=0;i<strLength;i++){
            randomString += alpha.charAt(Math.floor(Math.random()*alpha.length));
        }
        return  randomString;
    }else {
        return false;
    }
};

exports.checkTokenValidity = (token,callback) => {
    db.read('tokens',token,(err,data) => {
        if(!err && data){
            data = this.parseData(data);
            if(data.expires > Date.now()){
                callback(data);
            } else {
                callback(false)
            }
        } else
            callback(false);
    });
};

exports.getPage = (filename,callback, pageData = {}) => {
    const filePath = path.join(__dirname,'/../pages',`${filename}`);
    const layoutPath = path.join(__dirname,'/../pages','templates','layout.html');
    fs.readFile(layoutPath,'utf8',(err,data) => {
        const layoutData = data;
        fs.readFile(filePath,'utf8',(err, data) => {
            const fullData = layoutData.replace('{{ main-content }}',data);
            callback(this.interpolate(pageData,fullData));
        });
    });
};

exports.interpolate = ( data = {},pageData) => {
    for(let i in data){
        pageData.replace(`{{ ${i} }}`, data[i])
    }
    return pageData;
};

