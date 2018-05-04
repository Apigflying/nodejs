const mongoose = require('mongoose');
const config = require('../config.js');

mongoose.connect(config.mongodb);
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open',()=>{
  console.log('连接数据库成功')
})

db.on('error',(error)=>{
  console.log(error)
  mongoose.disconnect();
})

db.on('close',()=>{
  console.log('数据库断开，重新连接数据库');
  mongoose.connect(config.mongodb,{
    server:{
      auto_reconnect:true
    }
  })
})