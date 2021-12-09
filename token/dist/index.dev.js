"use strict";

var jsonWebToken = require('jsonwebtoken');

var SECRET_KEY = 'rewake007';

var setToken = function setToken(username) {
  return new Promise(function (resolve, reject) {
    var token = jsonWebToken.sign({
      user_name: username
    }, SECRET_KEY, {
      expiresIn: "72h"
    });
    resolve(token);
  });
}; // 解析token


var getToken = function getToken(token) {
  return new Promise(function (resolve, reject) {
    if (!token || token.split(' ')[1] == 'null') {
      console.log('token null');
      reject({
        error: 'token is null'
      });
    } else {
      // console.log(token.split('.'))    
      var info = jsonWebToken.verify(token.split(' ')[1], SECRET_KEY);
      console.log('解析出来的user', info);
      resolve(info);
    }
  });
};

module.exports = {
  SECRET_KEY: SECRET_KEY,
  setToken: setToken,
  getToken: getToken
};