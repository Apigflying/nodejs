const express = require('express');
const app = express();
const tools = require('./model/tools.js');
var db = require('./model/db.js')

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
app.post('/login', (req, res) => {
  tools.AnalysisParams(req).then(params => {
    console.log(params)
    return db.find('users', JSON.parse(params))
  }).then(result => {
    console.log(result)
    if (!result.length) {
      console.log('用户不存在')
      res.json({ 'result': false })
    } else {
      console.log(`用户存在,欢迎${result[0].name}`)
      res.json({ 'result': true, 'username': result.name })
    }
  })
})
app.listen(8000)