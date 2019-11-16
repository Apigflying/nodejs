const express = require('express');
const app = express();
const tools = require('./model/tools.js.js');
const ntool = require('./model/nodetools');
const db = require('./mongoose/db.js.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(cookieParser());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10000 },
    //cookie.maxAge用来设置cookie的过期时间
    /* 
    在登录验证中，
    （1） 第一次登录
    如果客户端浏览器登录成功了，服务器端会将 
        一段加密的字符  （包括用户名，或者其他信息，通过secret加密）
    保存到的下行的cookie中，req.session对象

    同时，服务器将session的信息保存到内存中
    （2） 再次发送请求
    当客户端再次发送请求来的时候，会携带这串cookie
    服务端通过req.session来识别用户身份

    */
  })
);
/*-----------------------------------*\
      name: String,//用户名
      possword:String,//密码
      sex:String,//
      age:Number,
      date: Date
  \*-----------------------------------*/
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
/*-----------------------------------*\
    测试nginx反向代理是否成功
\*-----------------------------------*/

app.get('/', (req, res) => {
  if (req.session.login == '1') {
    res.send(`欢迎${req.session.username}`);
  } else res.send('请登录');
});

app.post('/create', (req, res) => {
  tools.AnalysisParams(req).then((params) => {
    let userMes = JSON.parse(params);
    let psw = ntool.encrypt(userMes.password);
    console.log(psw);
    db
      .create({
        name: userMes.name,
        password: psw,
      })
      .then((result) => {
        res.send({
          result,
        });
      });
  });
});
app.post('/find', (req, res) => {
  console.log('拿到请求了');
  db.find({}).then((result) => {
    res.send({
      result,
    });
  });
});
app.post('/login', (req, res) => {
  let usersend;
  tools
    .AnalysisParams(req)
    .then((params) => {
      usersend = JSON.parse(params);
      return db.find({ name: usersend.name });
    })
    .then((result) => {
      let psw = ntool.encrypt(usersend.password);
      if (!result.length) {
        res.json({
          result: 'fail',
          message: '没有这个用户',
        });
      } else if (psw != result[0].password) {
        res.json({
          result: 'fail',
          message: '密码不正确',
        });
      } else {
        req.session.login = '1';
        req.session.username = result[0].name;
        res.json({
          result: 'success',
          message: '登录成功',
        });
      }

      console.log(usersend);
    });
});
app.listen(8000);
