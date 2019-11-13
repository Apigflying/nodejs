/*-----------------------------------*\
   使用express推荐的插件cookie-parser来与前端互相传输cookie
\*-----------------------------------*/
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const app = express();
app.use(cookieParser())
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 80000 },

  /*
   name: 设置 cookie 中， 保存 session 的字段名称， 默认为 connect.sid。
  store: session 的存储方式， 默认存放在内存中， 也可以使用 redis， mongodb 等。 express 生态中都有相应模块的支持。
  secret: 通过设置的 secret 字符串， 来计算 hash 值并放在 cookie 中， 使产生的 signedCookie 防篡改。
  cookie: 设置存放 session id 的 cookie 的相关选项， 默认为(
    default: { path: '/', httpOnly: true, secure: false, maxAge: null })
  genid: 产生一个新的 session_id 时， 所使用的函数， 默认使用 uid2 这个 npm 包。
  rolling: 每个请求都重新设置一个 cookie， 默认为 false。
  resave: 即使 session 没有被修改， 也保存 session 值， 默认为 true。
  */

}))

app.get("/", function(req, res) {
  if (req.session.login == "1") {
    res.send("欢迎" + req.session.username);
  } else {
    res.send("没有成功登陆");
  }
});

app.get("/login", function(req, res) {
  req.session.login = "1"; //设置这个session
  req.session.username = "cxy";
  res.send("你已经成功登陆");
});

app.listen(5000)