const express = require('express');
const app = express();
const tools = require('./model/tools.js');
var db = require('./mongoose/db.js')

/*-----------------------------------*\
    name: String,//用户名
    possword:String,//密码
    sex:String,//
    age:Number,
    date: Date
\*-----------------------------------*/
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
/*-----------------------------------*\
    测试nginx反向代理是否成功
\*-----------------------------------*/
app.get('/', (req, res) => {
  res.send('nginx访问成功')
})
app.post('/create', (req, res) => {
  tools.AnalysisParams(req).then(params => {
    db.create(JSON.parse(params)).then(result => {
      res.send({
        result
      })
    })
  })
})
app.post('/find', (req, res) => {
  console.log('拿到请求了')
  db.find({}).then(result => {
    res.send({
      result
    })
  })
})
app.listen(3000)