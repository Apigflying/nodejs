const express = require('express');
const routes = require('./routes/index.js');
const config  = require('./config.js');
const db = require('./mongodb/db.js');
const app = express();
// 处理跨域
app.all('*',function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})
// 验证token


routes(app);

app.listen(config.port,()=>{
  console.log(`Server Listen:http://localhost:${config.port}`);
});