const express = require('express');
const app = express();
const tools = require('./model/tools.js');
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/abc';
const db = mongoose.connect(DB_URL);
//使用Schema来定义常规的数据结构
var Schema = mongoose.Schema;

const userMessage = new Schema({
  username: { type: String },
  userpasswd: { type: String },
  // usersex: { type: String },
  // lastlogintime: { type: Date, default: Date.now() }
});

// , {
//   // collection: 'myuserlist', //自定义collection的名字。
//   versionKey: false //取消自带的v版本
// }
var UserMes = mongoose.model("UserMes", userMessage);
/*
  这里model的第一个参数，表示使用这个集合
  mongoose会将这个集合的名字进行复数处理
  cxy -> cxies
  ceshi -> ceshis
  会在后面加上's',如果是y结尾，会把 'y' 变 'i' 加 'es' 
  会将大写的改为小写的
  UserName -> usernames

  第二个参数表示使用userMessage这个数据结构的模式
*/
//如果该Model已经发布，则可以直接通过名字索引到，如下：



// var user = new UserMes({
//   username: 'abc',
//   userpasswd: '123',
//   usersex: 'nan',
//   lastlogintime: Date.now()
// })
// user.save((result) => {
//     console.log(result)
//   })
//var UserMes = mongoose.model('UserMes');
//如果没有发布，上一段代码将会异常

//用Model创建Entity实例
// var User1 = new UserMes({ name: 'User1' });

/*
  实例的方法：
    1.save（）
      将生成的实例本身保存到数据库
    
*/

// User1.save(); //执行完成后，数据库就有该数据了
/*
  对数据库的增删改查
  CRUD
  Create Retrieve Update Delete
   增       查       改     删
*/

// const CreateUser = uermes => {
//   return new Promise((resolve, reject) => {
//     // var user = new UserMes(uermes);
//     // user.save((result) => {
//     //   resolve(result)
//     // });
//     UserMes.create(uermes, (err, user) => {
//       resolve(user)
//     })
//   })
// }
// const jx = (req) => {
//   return new Promise((resolve, reject) => {
//     tools.AnalysisParams(req).then(obj => {
//       resolve(obj)
//     })
//   })
// }

//查
// app.get('/find', (req, res) => {
//   Ceshi.find({}, (err, doc) => {
//     res.send(doc)
//   })
// })
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/create', (req, res) => {
  tools.AnalysisParams(req).then(data => {
    var jsondata = JSON.parse(data)
      // if (Object.values(jsondata).indexOf('') > -1 || Object.values(jsondata).length < 4) {
      //   res.send('有必填项没有填写')
      //   return
      // }
    var user_1 = new UserMes(jsondata);
    user_1.save(function(err) {
      res.send('数据插入成功');
    });
  })
})


// app.get('/update', (req, res) => {
//   Ceshi.update({ name: 'cxy' }, { $set: { 'abc': 'rechange' } }, (err, result) => {
//     res.send(result)
//   })
// })









mongoose.connection.on('connected', () => {
  console.log('连接数据库成功')
})
mongoose.connection.on('error', () => {
  console.log('链接数据库失败')
})
mongoose.connection.on('disconnected', () => {
  console.log('连接断开')
})
app.listen(8000)