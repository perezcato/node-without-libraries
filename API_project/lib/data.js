const path = require('path');
const fs = require('fs');

const lib = {
    baseDir: path.join(__dirname,'/../.data/'),
    create: (dir, file, data, callback) => {
        fs.open(`${lib.baseDir}${dir}/${file}.json`,'wx',(err, fd) => {
            if(!err && fd)
                fs.writeFile(fd,JSON.stringify(data),(err) => {
                    if(!err)
                        fs.close(fd,(err) => {
                            if (!err)
                                callback(false);
                            else
                                callback(err);
                        });
                    else
                        callback(err);
                });
            else
                callback(err);
        });
    },
    read: (dir,filename,callback) => {
        fs.readFile(`${lib.baseDir}${dir}/${filename}.json`,'utf-8',(err,data) => {
            callback(err,data);
        });
    },
    update: (dir,file,data,callback) => {
        fs.open(`${lib.baseDir}${dir}/${file}.json`,'r+',(err,fd) => {
            if(!err && fd)
                fs.truncate(`${lib.baseDir}${dir}/${file}.json`,(err) => {
                    if(!err)
                        fs.writeFile(fd,JSON.stringify(data),(err) => {
                            if(!err)
                                fs.close(fd,(err) => {
                                    callback(false);
                                });
                            else
                                callback(err)
                        });
                    else
                        callback(err);
                })
        });
    },
    delete: (dir,filename,callback) => {
        fs.unlink(`${lib.baseDir}${dir}/${filename}.json`, (err) => {
            if(!err)
                callback(false);
            else
                callback(err);
        })
    },
    list: (dir,callback) => {
        fs.readdir(`${lib.baseDir}${dir}/`,(err,files) => {
            let checkId = [];
            if(!err && files && files.length > 0){
                files.forEach((file) => {
                    checkId.push(file.replace('.json',''));
                });
                callback(false,checkId);
            }else
                callback(err,files);
        });
    }
};

module.exports = lib;
