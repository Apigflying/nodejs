const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

exports = function createToke (payload, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.dirname(__filename)+'/secret.key', function (err, data) {
      if (err) {
        reject(err)
      }
      console.log(payload);
      
      jwt.sign(payload, data, options, function (err, token) {
        resolve(token);
      })
    })
  })
};

exports = function verifyToken(){

}