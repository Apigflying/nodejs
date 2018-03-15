/*-----------------------------------*\
   mongoose操作数据库封装DAO层
   已完成项目：增，查
   待完成项目：删，改
\*-----------------------------------*/

const mongoose = require("mongoose");
const User = require('./connect');
exports.create = (data) => {
  return new Promise((resolve, reject) => {
    const newuser = new User(data);
    newuser.save(function(err) {
      if (err) {
        reject(err);
      } else {
        resolve('success')
      }
    });
  })
}
exports.find = (data = {}) => {
  return new Promise((resolve, reject) => {
    User.find(data, (err, docs) => {
      console.log(data, docs)
      if (err) {
        reject(err)
      }
      //无论是否存在，返回的数据都是数组
      resolve(docs)
    })
  })
}